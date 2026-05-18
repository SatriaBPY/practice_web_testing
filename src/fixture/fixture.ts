import { test as base, expect, Page, BrowserContext } from "@playwright/test";
import { BasePage } from "@pages/base_page";
import LoginPage from "@pages/login_page";
import HomePage from "@pages/home_page";
import CartPage from "@pages/cart_page";
import ProductDetailPage from "@pages/product_detail";
import APIHelper from "@helper/apihelper";
import CartServices from "@services/cart_services";
import path from "path";
import fs from "fs";
import { EnvironmentManager } from "@helper/utils";

let context: BrowserContext;
let page: Page;

type MyOptions = {
  needsAuth: boolean;
  extraProduct: boolean;
};

type MyFixture = {
  page: Page;
  homePage: HomePage;
  cartPage: CartPage;
  productDetailPage: ProductDetailPage;
  homePageShared: HomePage;
  cartPageShared: CartPage;
  productDetailPageShared: ProductDetailPage;
  sharedPage: Page;
  home: HomePage;
  apiHelper: APIHelper;
  productDetail: ProductDetailPage;
  outOfstock: ProductDetailPage;
  productDetails: ProductDetailPage; //for auth
  outOfstocks: ProductDetailPage; // for auth
  cartServices: CartServices;
  addProductTocart: CartServices;
  addProductTocart2: CartServices;
  gotoCheckout: CartPage;
  loginPage: LoginPage;
  loginSharedPage: LoginPage;
};

export const test = base.extend<MyOptions & MyFixture>({
  needsAuth: [false, { option: true }],
  page: async ({ browser, needsAuth }, use) => {
    const storagePath = path.join(
      process.cwd(),
      "auth/state/storageState.json",
    );

    let contexts;
    if (needsAuth) {
      if (!fs.existsSync(storagePath)) {
        throw new Error(
          `Storage state file not found at ${storagePath}. Please login first to generate it.`,
        );
      }
      console.log("✅ Auth requested, injecting storageState...");
      contexts = await browser.newContext({
        storageState: storagePath,
        ignoreHTTPSErrors: true,
      });
    } else {
      contexts = await browser.newContext({ ignoreHTTPSErrors: true });
    }

    const page = await contexts.newPage();
    await use(page);
    await contexts.close();
  },

  gotoCheckout: async ({ cartPage, page }, use) => {
    // await cartPage.gotoUrl("checkout");
    const baseUrl = EnvironmentManager.getCredentials();
    await page.goto(`${baseUrl.base_url}/checkout`);
    await cartPage.stepIndecator.waitFor({ state: "visible" });
    await use(cartPage);
  },

  cartServices: async ({ request }, use) => {
    const services = new CartServices(request);
    await use(services);
  },

  extraProduct: [false, { option: true }],

  addProductTocart: async (
    { page, cartServices, homePage, extraProduct },
    use,
  ) => {
    const baseUrl = EnvironmentManager.getCredentials();
    await page.goto(`${baseUrl.base_url}`);
    const cartid = await cartServices.getCartId();

    const getId = await homePage.captureApiRespone();

    if (!getId?.data?.[1]?.id) {
      throw new Error("Failed to get product data from API");
    }

    const firstProductId = getId.data[1].id;

    await homePage.injectSessinStorage(cartid);

    await cartServices.addProductToCartAsGuest(firstProductId, cartid);
    console.log("Added first product:", firstProductId);

    if (extraProduct) {
      if (!getId.data?.[2]?.id) {
        throw new Error("Extra product not found in API response");
      }

      const secondProductId = getId.data[2].id;
      await cartServices.addProductToCartAsGuest(secondProductId, cartid);
      console.log("Added extra product:", secondProductId);
    }

    console.log("Cart ID:", cartid);
    await page.reload({ waitUntil: "networkidle" });

    await use(cartServices);
  },
  home: async ({ homePage, page }, use) => {
    const baseUrl = EnvironmentManager.getCredentials();
    await page.goto(`${baseUrl.base_url}`);
    await use(homePage);
  },
  apiHelper: async ({ page }, use) => {
    const helper = new APIHelper(page);
    await use(helper);
  },
  productDetail: async ({ homePage, page, needsAuth, productDetailPage }, use) => {
    const storagePath = path.join(process.cwd(), "auth/state/storageState.json");
  
    if (needsAuth) {
      const context = page.context();
      const state = await context.storageState();
      const hasAuthCookies = state.cookies?.length > 0;
     ;
  
      if (!hasAuthCookies) {
        if (!fs.existsSync(storagePath)) {
          throw new Error(
            `Storage state file not found at ${storagePath}. Please login first to generate it.`
          );
        }
        console.log("⚠️ No auth cookies detected, injecting fallback storageState...");
  
        const storageState = JSON.parse(fs.readFileSync(storagePath, "utf-8"));
        await context.addCookies(storageState.cookies);
        
        if (storageState.origins && storageState.origins.length > 0) {
          const baseUrl = EnvironmentManager.getCredentials();
          await page.goto(`${baseUrl.base_url}`);
          
          for (const origin of storageState.origins) {
            await page.evaluate((originData) => {
              for (const item of originData.localStorage) {
                localStorage.setItem(item.name, item.value);
              }
            }, origin);
          }
        }
        
        await page.waitForTimeout(1000);
      }
    }

    const homePages = new HomePage(page)

    const baseUrl = EnvironmentManager.getCredentials();
    await page.goto(`${baseUrl.base_url}`);
    await page.waitForLoadState('domcontentloaded');
  
    const getId = await homePage.captureApiRespone();
  
    if (!getId?.data?.[0]?.id) {
      throw new Error("Failed to capture product ID from API response");
    }
  
    const productId = getId.data[0].id;
    await homePages.productPrice.waitFor({ state: 'visible', timeout: 10000 });
    
    await page.goto(`${baseUrl.base_url}product/${productId}`, {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    await page.waitForLoadState('domcontentloaded');
  
  
    await use(productDetailPage);
  },

  productDetails: async ({ browser, needsAuth }, use) => {
    const storagePath = path.join(
      process.cwd(),
      "auth/state/storageState.json",
    );
    const baseUrl = EnvironmentManager.getCredentials();

    let contexts;
    if (needsAuth) {
      contexts = await browser.newContext({
        storageState: storagePath,
        ignoreHTTPSErrors: true,
      });
    } else {
      contexts = await browser.newContext({
        ignoreHTTPSErrors: true,
      });
    }

    const page = await contexts.newPage();
    const homePage = new HomePage(page);
    await page.goto(`${baseUrl.base_url}`);
    const getId = await homePage.captureApiRespone()
    
    if (!getId?.data?.[0]?.id) {
      throw new Error("Out of stock product not found in API response");
    }

    const productId = getId.data[0].id;
    await page.goto(`${baseUrl.base_url}product/${productId}`);
      
    const productDetailPage = new ProductDetailPage(page);
    await use(productDetailPage);
      
    
    await contexts.close();
  },
  
  outOfstock: async ({ homePage, page, needsAuth, productDetailPage }, use) => {
    const baseUrl = EnvironmentManager.getCredentials();
    
    if (needsAuth) {
      const storagePath = path.join(process.cwd(), "auth/state/storageState.json");
      const context = page.context();
      const state = await context.storageState();
      const hasAuthCookies = state.cookies?.length > 0;
  
      if (!hasAuthCookies) {
        if (!fs.existsSync(storagePath)) {
          throw new Error(
            `Storage state file not found at ${storagePath}. Please login first.`
          );
        }
        console.log("⚠️ Injecting auth state for outOfstock fixture...");
        
        const storageState = JSON.parse(fs.readFileSync(storagePath, "utf-8"));
        await context.addCookies(storageState.cookies);
        await page.waitForTimeout(1000);
      }
    }

     const homePages = new HomePage(page)
  
    await page.goto(`${baseUrl.base_url}`);
    await page.waitForLoadState('domcontentloaded');
  
    const getId = await homePages.captureApiRespone();
  
    if (!getId?.data?.[3]?.id) {
      throw new Error("Out of stock product not found in API response");
    }
  
    const productId = getId.data[3].id;
    
    await page.goto(`${baseUrl.base_url}product/${productId}`, { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    await page.waitForLoadState('domcontentloaded');
  
    await use(productDetailPage);
  },
  outOfstocks: async ({ browser, needsAuth }, use) => {
    const storagePath = path.join(
      process.cwd(),
      "auth/state/storageState.json",
    );
    const baseUrl = EnvironmentManager.getCredentials();

    let contexts;
    if (needsAuth) {
      contexts = await browser.newContext({
        storageState: storagePath,
        ignoreHTTPSErrors: true,
      });
    } else {
      contexts = await browser.newContext({
        ignoreHTTPSErrors: true,
      });
    }

    const page = await contexts.newPage();
    const homePage = new HomePage(page);
    await page.goto(`${baseUrl.base_url}`);
    const getId = await homePage.captureApiRespone()
    
    if (!getId?.data?.[3]?.id) {
      throw new Error("Out of stock product not found in API response");
    }

    const productId = getId.data[3].id;
    await page.goto(`${baseUrl.base_url}product/${productId}`);
      
    const productDetailPage = new ProductDetailPage(page);
    await use(productDetailPage);
      
    
    await contexts.close();
  },
  // 

  sharedPage: async ({ browser }, use) => {
    if (!context) {
      context = await browser.newContext({ ignoreHTTPSErrors: true });
      page = await context.newPage();
    }
    await use(page);
  },
  homePage: async ({ page }, use) => use(new HomePage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  homePageShared: async ({ sharedPage }, use) => use(new HomePage(sharedPage)),
  cartPageShared: async ({ sharedPage }, use) => use(new CartPage(sharedPage)),
  productDetailPageShared: async ({ sharedPage }, use) =>
    use(new ProductDetailPage(sharedPage)),
  loginSharedPage: async ({ sharedPage }, use) =>
    use(new LoginPage(sharedPage)),
});

export { expect };

test.afterAll(async () => {
  await context?.close();
});
