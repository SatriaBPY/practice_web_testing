import { test, expect } from "src/fixture/fixture";

// test.describe("Product Detail-Authenticated Tests", () => {
//   test.describe.configure({ mode: "serial" });
//   //test.use({ needsAuth: true });
//   //test.use({ storageState: "auth/state/storageState.json" });

  
//   test(
//     "TCPD-030 - Add Out of Stock product to favorites",
//     { tag: ["@regression", "@flaky", "@test"] },
//     async ({ outOfstock, productDetailPage, page }) => {
//       await expect(productDetailPage.addtofavBtn).toBeVisible();
//       await productDetailPage.addToFavAction();
//       await expect(productDetailPage.successAddfav).toBeVisible();
//     },
//   );

//   test(
//     "TCPD-033 - Verify Success toast add to favorites auto-dismisses",
//     { tag: ["@regression", "@flaky", "@test"] },
//     async ({ outOfstock, productDetailPage, page }) => {
//       await expect(productDetailPage.addtofavBtn).toBeVisible();
//       await productDetailPage.addToFavAction();
//       await expect(productDetailPage.duplicateAddfav).toBeVisible();
//       await expect(productDetailPage.duplicateAddfav).toBeHidden({
//         timeout: 10000,
//       });
//     },
//   );

  // test(
  //   "TCPD-028 - Add product to favorites",
  //   { tag: ["@smoke", "@regression", "@flaky", "@test"] },
  //   async ({ page, productDetail, productDetailPage }) => {
  //     await expect(productDetailPage.addtofavBtn).toBeVisible();
  //     await expect(productDetailPage.priceProduct).toBeVisible();
  //     await expect(productDetailPage.addtofavBtn).toBeEnabled();
  //     await productDetailPage.addToFavAction();
  //     await expect(productDetailPage.successAddfav).toBeVisible();
  //   },
  // );


//   test(
//     "TCPD-029 - Add duplicate product to favorites",
//     { tag: ["@regression", "@flaky", "@test"] },
//     async ({ productDetail, productDetailPage, page }) => {
//       await expect(productDetailPage.addtofavBtn).toBeVisible();
//       await productDetailPage.addToFavAction();
//       await expect(productDetailPage.duplicateAddfav).toBeVisible();
//     },
//   );

// }); 
// 
// 
test.describe("Product Detail-Authenticated Tests", () => {
  test.describe.configure({ mode: "serial" });
  test(
    "TCPD-030 - Add Out of Stock product to favorites",
    { tag: ["@regression", "@flaky", "@test"] },
    async ({ outOfstockAuth, productDetailPageAuth, authPage }) => {
      await productDetailPageAuth.accountNameVerification();
      await expect(productDetailPageAuth.addtofavBtn).toBeVisible();
      await productDetailPageAuth.addToFavAction();
      await expect(productDetailPageAuth.successAddfav).toBeVisible();
    },
  );

  test(
    "TCPD-033 - Verify Success toast add to favorites auto-dismisses",
    { tag: ["@regression", "@flaky", "@test"] },
    async ({ outOfstockAuth, productDetailPageAuth, authPage }) => {
       await productDetailPageAuth.accountNameVerification();
      await expect(productDetailPageAuth.addtofavBtn).toBeVisible();
      await productDetailPageAuth.addToFavAction();
      await expect(productDetailPageAuth.duplicateAddfav).toBeVisible();
      await expect(productDetailPageAuth.duplicateAddfav).toBeHidden({
        timeout: 10000,
      });
    },
  );

  test(
    "TCPD-028 - Add product to favorites",
    { tag: ["@smoke", "@regression", "@flaky", "@test"] },
    async ({ productDetailAuth, productDetailPageAuth, authPage }) => {
      await productDetailPageAuth.accountNameVerification();
      await expect(productDetailPageAuth.addtofavBtn).toBeVisible();
      await expect(productDetailPageAuth.addtofavBtn).toBeEnabled();
      await productDetailPageAuth.addToFavAction();
      await expect(productDetailPageAuth.successAddfav).toBeVisible();
    },
  );


  test(
    "TCPD-029 - Add duplicate product to favorites",
    { tag: ["@regression", "@flaky", "@test"] },
    async ({ productDetailAuth, productDetailPageAuth, authPage }) => {
       await productDetailPageAuth.accountNameVerification();
      await expect(productDetailPageAuth.addtofavBtn).toBeVisible();
      await productDetailPageAuth.addToFavAction();
      await expect(productDetailPageAuth.duplicateAddfav).toBeVisible();
    },
  );

}); 