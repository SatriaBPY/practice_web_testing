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

let contexts: BrowserContext;
let pages: Page;

type MyOptions = {
  // /needsAuth: boolean;
  extraProduct: boolean;
};

type MyFixture = {
  page: Page;
  home: HomePage;
  homePage: HomePage;
  cartPage: CartPage;
  productDetailPage: ProductDetailPage;
  apiHelper: APIHelper;
  productDetail: ProductDetailPage;
  outOfstock: ProductDetailPage;
  cartServices: CartServices;
  addProductTocart: CartServices;
  addProductTocart2: CartServices;
  gotoCheckout: CartPage;
  loginPage: LoginPage;
};

type authFixture = {
  authPage: Page
  homeAuth: HomePage;
  homePageAuth: HomePage;
  cartPageAuth: CartPage;
  productDetailPageAuth: ProductDetailPage;
  loginPageAuth: LoginPage;
  apiHelperAuth: APIHelper;
  productDetailAuth: ProductDetailPage;
  outOfstockAuth: ProductDetailPage;
  cartServicesAuth: CartServices;
  addProductTocartAuth: CartServices;
  gotoCheckoutAuth: CartPage;
}

type sharedFixture = {
  sharedPage: Page;
  homePageShared: HomePage;
  cartPageShared: CartPage;
  productDetailPageShared: ProductDetailPage;
  loginSharedPage: LoginPage;
}

export const test = base.extend<MyOptions & MyFixture & sharedFixture & authFixture>({
  // needsAuth: [false, { option: true }],
  page: async ({ browser }, use) => {
    // const storagePath = path.join(
    //   process.cwd(),
    //   "auth/state/storageState.json",
    // );

    // let contexts;
    // if (needsAuth) {
    //   if (!fs.existsSync(storagePath)) {
    //     throw new Error(
    //       `Storage state file not found at ${storagePath}. Please login first to generate it.`,
    //     );
    //   }
    //   console.log("✅ Auth requested, injecting storageState...");
    //   contexts = await browser.newContext({
    //     storageState: storagePath,
    //     ignoreHTTPSErrors: true,
    //   });
    // } else {
      const contexts = await browser.newContext({ ignoreHTTPSErrors: true });
      //}

    const page = await contexts.newPage();
    await use(page);
    await contexts.close();
  },
  extraProduct: [false, { option: true }],
  
  authPage: async ({ browser }, use) => {
    const storagePath = path.join(
        process.cwd(),
        "auth/state/storageState.json",
      );
    const contexts = await browser.newContext({ ignoreHTTPSErrors: true, storageState: storagePath });
    const page = await contexts.newPage();
    await use(page);
    await contexts.close();
  },

  cartServicesAuth: async ({ request }, use) => {
    const services = new CartServices(request);
    await use(services);
  },

  gotoCheckoutAuth: async ({ cartPageAuth, authPage }, use) => {
    // await cartPage.gotoUrl("checkout");
    const baseUrl = EnvironmentManager.getCredentials();
    await authPage.goto(`${baseUrl.base_url}/checkout`);
    await cartPageAuth.stepIndecator.waitFor({ state: "visible" });
    await use(cartPageAuth);
  },

  addProductTocartAuth: async (
    { authPage, cartServicesAuth, homePageAuth, extraProduct },
    use,
  ) => {
    const baseUrl = EnvironmentManager.getCredentials();
    await authPage.goto(`${baseUrl.base_url}`);
    const cartid = await cartServicesAuth.getCartId();

    const getId = await homePageAuth.captureApiRespone();

    if (!getId?.data?.[1]?.id) {
      throw new Error("Failed to get product data from API");
    }

    const firstProductId = getId.data[1].id;

    await homePageAuth.injectSessinStorage(cartid);

    await cartServicesAuth.addProductToCartAsGuest(firstProductId, cartid);
    console.log("Added first product:", firstProductId);

    if (extraProduct) {
      if (!getId.data?.[2]?.id) {
        throw new Error("Extra product not found in API response");
      }

      const secondProductId = getId.data[2].id;
      await cartServicesAuth.addProductToCartAsGuest(secondProductId, cartid);
      console.log("Added extra product:", secondProductId);
    }

    console.log("Cart ID:", cartid);
    await authPage.reload({ waitUntil: "networkidle" });

    await use(cartServicesAuth);
  },
  homeAuth: async ({ homePageAuth, authPage }, use) => {
    const baseUrl = EnvironmentManager.getCredentials();
    await authPage.goto(`${baseUrl.base_url}`);
    await use(homePageAuth);
  },
  apiHelperAuth: async ({ authPage }, use) => {
    const helper = new APIHelper(authPage);
    await use(helper);
  },
  productDetailAuth: async ({ homePageAuth, authPage, productDetailPageAuth }, use) => {

    const homePages = new HomePage(authPage)

    const baseUrl = EnvironmentManager.getCredentials();
    await authPage.goto(`${baseUrl.base_url}`);
    await authPage.waitForLoadState('domcontentloaded');
  
    const getId = await homePages.captureApiRespone();
  
    if (!getId?.data?.[0]?.id) {
      throw new Error("Failed to capture product ID from API response");
    }
  
    const productId = getId.data[0].id;
    await homePages.productPrice.waitFor({ state: 'visible', timeout: 10000 });
    
    await authPage.goto(`${baseUrl.base_url}product/${productId}`);
    
    await authPage.waitForLoadState('domcontentloaded');
  
  
    await use(productDetailPageAuth);
  },
  outOfstockAuth: async ({ homePageAuth, authPage, productDetailPageAuth }, use) => {
    const baseUrl = EnvironmentManager.getCredentials();
    

     const homePages = new HomePage(authPage)
  
    await authPage.goto(`${baseUrl.base_url}`);
    await authPage.waitForLoadState('domcontentloaded');
  
    const getId = await homePages.captureApiRespone();
  
    if (!getId?.data?.[3]?.id) {
      throw new Error("Out of stock product not found in API response");
    }
  
    const productId = getId.data[3].id;
    
    await authPage.goto(`${baseUrl.base_url}product/${productId}`);
    
    await authPage.waitForLoadState('domcontentloaded');
  
    await use(productDetailPageAuth);
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
  productDetail: async ({ homePage, page, productDetailPage }, use) => {
    const storagePath = path.join(process.cwd(), "auth/state/storageState.json");

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
    
    await page.goto(`${baseUrl.base_url}product/${productId}`);
    
    await page.waitForLoadState('domcontentloaded');
  
  
    await use(productDetailPage);
  },

  outOfstock: async ({ homePage, page, productDetailPage }, use) => {
    const baseUrl = EnvironmentManager.getCredentials();
    

     const homePages = new HomePage(page)
  
    await page.goto(`${baseUrl.base_url}`);
    await page.waitForLoadState('domcontentloaded');
  
    const getId = await homePages.captureApiRespone();
  
    if (!getId?.data?.[3]?.id) {
      throw new Error("Out of stock product not found in API response");
    }
  
    const productId = getId.data[3].id;
    
    await page.goto(`${baseUrl.base_url}product/${productId}`);
    
    await page.waitForLoadState('domcontentloaded');
  
    await use(productDetailPage);
  },
  
  sharedPage: async ({ browser }, use) => {
    if (!contexts) {
      contexts = await browser.newContext({ ignoreHTTPSErrors: true });
      pages = await contexts.newPage();
    }
    await use(pages);
  },
  homePageAuth: async ({ authPage }, use) => use(new HomePage(authPage)),
  cartPageAuth: async ({ authPage }, use) => use(new CartPage(authPage)),
  productDetailPageAuth: async ({ authPage }, use) => use(new ProductDetailPage(authPage)),
  loginPageAuth: async ({ authPage }, use) => use(new LoginPage(authPage)),
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
  await contexts?.close();
});
