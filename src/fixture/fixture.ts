import { test as base, expect, Page, BrowserContext } from "@playwright/test";
import { BasePage } from "@pages/base_page";
import LoginPage from "@pages/login_page";
import HomePage from "@pages/home_page";
import CartPage from "@pages/cart_page";
import ProductDetailPage from "@pages/product_detail";
import APIHelper from "@helper/apihelper";
import CartServices from "@services/cart_services";
import path from "path";

let context: BrowserContext
let page: Page;

type MyOptions = {
  needsAuth: boolean;
  extraProduct: boolean,
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
    const storagePath = path.join(
      process.cwd(),
      "auth/state/storageState.json",
    );

    const context = await browser.newContext({
      storageState: needsAuth ? storagePath : undefined,
      ignoreHTTPSErrors: true,
      
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  gotoCheckout: async ({ cartPage }, use) => {
    await cartPage.gotoUrl("checkout");
    await cartPage.stepIndecator.waitFor({ state: "visible" });
    await use(cartPage);
  },

  cartServices: async ({ request }, use) => {
    const services = new CartServices(request);

    await use(services);
  },
  extraProduct: [false, { option: true }],
  addProductTocart: async ({ cartServices, homePage, page, extraProduct }, use) => {
      const cartid = await cartServices.getCartId();
      await homePage.gotoUrl("");
      
      const getId = await homePage.captureApiRespone();
      
      
      const firstProductId = getId.data[1]?.id;
      await homePage.injectSessinStorage(cartid);
      await cartServices.addProductToCartAsGuest(firstProductId, cartid);
  
      
      if (extraProduct) {
        const secondProductId = getId.data[2]?.id;
        console.log(`Adding extra product: ${secondProductId}`);
        await cartServices.addProductToCartAsGuest(secondProductId, cartid);
      }
  
      console.log("Cart ID:", cartid, "First Product:", firstProductId);
      
      await page.reload();
      await use(cartServices);
    },
  home: async ({ homePage }, use) => {
    await homePage.gotoUrl("");
    await use(homePage);
  },
  apiHelper: async ({ page }, use) => {
    const helper = new APIHelper(page);
    await use(helper);
  },
  productDetail: async ({ homePage }, use) => {
    await homePage.gotoUrl("");
    const getId = await homePage.captureApiRespone();
    const productId = getId.data[0]?.id;
    await homePage.gotoUrl(`product/${productId}`);
    await use(homePage);
  },
  outOfstock: async ({ homePage }, use) => {
    await homePage.gotoUrl("");
    const getId = await homePage.captureApiRespone();
    const productId = getId.data[3]?.id;
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
  loginPage: async ({page}, use) => use (new LoginPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  homePageShared: async ({ sharedPage }, use) => use(new HomePage(sharedPage)),
  cartPageShared: async ({ sharedPage }, use) => use(new CartPage(sharedPage)),
  productDetailPageShared: async ({ sharedPage }, use) =>
    use(new ProductDetailPage(sharedPage)),
  loginSharedPage: async ({ sharedPage }, use) => use(new LoginPage(sharedPage)),
});

export { expect };

test.afterAll(async () => {
  await context?.close();
});