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
  productDetail: HomePage;
  outOfstock: HomePage;
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
      const storagePath = path.join(process.cwd(), "auth/state/storageState.json");
  
      let contexts;
      if (needsAuth) {
        if (!fs.existsSync(storagePath)) {
          throw new Error(
            `Storage state file not found at ${storagePath}. Please login first to generate it.`
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
  home: async ({ homePage , page}, use) => {
    const baseUrl = EnvironmentManager.getCredentials();
    await page.goto(`${baseUrl.base_url}`);
    await use(homePage);
  },
  apiHelper: async ({ page }, use) => {
    const helper = new APIHelper(page);
    await use(helper);
  },
  productDetail: async ({ homePage, page, needsAuth }, use) => {
     const storagePath = path.join(process.cwd(), "auth/state/storageState.json");

     if (needsAuth) {
        const context = page.context();
        const state = await context.storageState();
    
        const hasAuthCookies = state.cookies?.length > 0;
    
        if (!hasAuthCookies) {
          if (!fs.existsSync(storagePath)) {
            throw new Error(
              `Storage state file not found at ${storagePath}. Please login first to generate it.`
            );
          }
          console.log("⚠️ No auth cookies detected, injecting fallback storageState...");
    
          await context.addCookies(JSON.parse(fs.readFileSync(storagePath, "utf-8")).cookies);
          await page.reload({ waitUntil: "networkidle" });
        }
      }
    
    const baseUrl = EnvironmentManager.getCredentials();
    await page.goto(`${baseUrl.base_url}`);

    const getId = await homePage.captureApiRespone();

    if (!getId?.data?.[0]?.id) {
      throw new Error("Failed to capture product ID from API response");
    }
    

    const productId = getId.data[0].id;
    await homePage.productPrice.waitFor({state: 'visible'})
    await page.goto(`${baseUrl.base_url}product/${productId}`);

    await use(homePage);
  },
  outOfstock: async ({ homePage ,page}, use) => {
    const baseUrl = EnvironmentManager.getCredentials();
    await page.goto(`${baseUrl.base_url}`);

    const getId = await homePage.captureApiRespone();

    if (!getId?.data?.[3]?.id) {
      throw new Error("Out of stock product not found in API response");
    }

    const productId = getId.data[3].id;
    await homePage.gotoUrl(`product/${productId}`);

    await use(homePage);
  },

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
