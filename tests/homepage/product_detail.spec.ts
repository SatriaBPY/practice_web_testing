import { test, expect } from "src/fixture/fixture";

// test.describe("Product Detail-Authenticated Tests", () => {
//   test.describe.configure({ mode: "serial" });
//   test.use({ needsAuth: true });

//   test(
//     "TCPD-028 - Add product to favorites",
//     { tag: ["@smoke", "@regression", "@flaky", "@test"] },
//     async ({ page, productDetail, productDetailPage }) => {
//       await expect(productDetailPage.addtofavBtn).toBeVisible();
//       await expect(productDetailPage.priceProduct).toBeVisible();
//       await expect(productDetailPage.addtofavBtn).toBeEnabled();
//       await productDetailPage.addToFavAction();
//       // await expect(async () => {
//       //   await expect(productDetailPage.successAddfav).toBeVisible({
//       //     timeout: 2000,
//       //   });
//       // }).toPass({ timeout: 10000 });
//       await expect(productDetailPage.successAddfav).toBeVisible();
//     },
//   );


//   test(
//     "TCPD-029 - Add duplicate product to favorites",
//     { tag: ["@regression", "@flaky", "@test"] },
//     async ({ productDetail, productDetailPage, page }) => {
//       await expect(productDetailPage.addtofavBtn).toBeVisible();
//       await productDetailPage.addToFavAction();
//       await expect(productDetailPage.duplicateAddfav).toBeVisible();
//     },
//   );

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
// }); 


test.describe("Product Detail ", () => {
  test(
    "TCPD-001 - Product information showns",
    { tag: ["@smoke", "@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.titleProduct).toBeVisible();
      await expect(productDetailPage.description).toBeVisible();
      await expect(productDetailPage.specificationTable).toBeVisible();
      await expect(productDetailPage.co2rating).toBeVisible();
      await expect(productDetailPage.priceProduct).toBeVisible();
      await expect(productDetailPage.specificationTitle).toBeVisible();
    },
  );

  test(
    "TCPD-002 - Verify components for Out of Stock products",
    { tag: ["@regression"] },
    async ({ outOfstock, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await expect(productDetailPage.addtocartBtn).toBeDisabled();
      await expect(productDetailPage.qttField).toBeDisabled();
      await expect(productDetailPage.minusQttBtn).toBeDisabled();
      await expect(productDetailPage.maxQttBtn).toBeDisabled();
    },
  );

  test(
    "TCPD-003 - Verify quantity components",
    { tag: ["@smoke", "@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.qttField).toBeVisible();
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await expect(productDetailPage.maxQttBtn).toBeVisible();
    },
  );

  test(
    "TCPD-004 - Verify default quantity value",
    { tag: ["@smoke", "@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.qttField).toBeVisible();
      await expect(productDetailPage.qttField).toHaveValue("1");
    },
  );

  test(
    "TCPD-005 - Quantity field disabled for Out of Stock",
    { tag: ["@regression"] },
    async ({ outOfstock, productDetailPage, page }) => {
      await expect(productDetailPage.qttField).toBeVisible();
      await expect(productDetailPage.qttField).toBeDisabled();
    },
  );

  test(
    "TCPD-006 - Plus/Minus buttons disabled for Out of Stock",
    { tag: ["@regression"] },
    async ({ outOfstock, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeDisabled();
      await expect(productDetailPage.maxQttBtn).toBeDisabled();
    },
  );

  test(
    "TCPD-007 - Increase quantity by 1 using plus (+)",
    { tag: ["@smoke", "@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.maxQttAction(1);
      await expect(productDetailPage.qttField).toHaveValue("2");
    },
  );

  test(
    "TCPD-008 - Increase quantity by 5 using plus (+)",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.maxQttAction(5);
      await expect(productDetailPage.qttField).toHaveValue("6");
    },
  );

  test(
    "TCPD-009 - Increase quantity for Out of Stock product",
    { tag: ["@regression"] },
    async ({ outOfstock, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await expect(productDetailPage.minusQttBtn).toBeDisabled();
      await productDetailPage.maxQttAction(1).catch(() => false);
      await expect(productDetailPage.qttField).toHaveValue("1");
    },
  );

  test(
    "TCPD-010 - Decrease quantity by 1 using minus (-)",
    { tag: ["@smoke", "@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.maxQttAction(2);
      await expect(productDetailPage.qttField).toHaveValue("3");
      await productDetailPage.minQttAction(1);
      await expect(productDetailPage.qttField).toHaveValue("2");
    },
  );

  test(
    "TCPD-011 - Decrease quantity by 3 using minus (-)",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.maxQttAction(4);
      await expect(productDetailPage.qttField).toHaveValue("5");
      await productDetailPage.minQttAction(3);
      await expect(productDetailPage.qttField).toHaveValue("2");
    },
  );

  test(
    "TCPD-012 - Decrease below minimum limit (1)",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await expect(productDetailPage.qttField).toHaveValue("1");
      await productDetailPage.minQttAction(1);
      await expect(productDetailPage.qttField).toHaveValue("1");
    },
  );

  test(
    "TCPD-013 - Decrease to minimum from specific value",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.inputQtt("2");
      await expect(productDetailPage.qttField).toHaveValue("2");
      await productDetailPage.minQttAction(2);
      await expect(productDetailPage.qttField).toHaveValue("1");
    },
  );

  test(
    "TCPD-014 - Enter quantity manually via input field",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.inputQtt("4");
      await expect(productDetailPage.qttField).toHaveValue("4");
    },
  );

  test(
    "TCPD-015 - Enter maximum limit manually",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.inputQtt("999999999");
      await expect(productDetailPage.qttField).toHaveValue("999999999");
    },
  );

  test(
    "TCPD-016 - Enter value exceeding maximum limit",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.inputQtt("9999999999");
      await expect(productDetailPage.qttField).toHaveValue("999999999");
    },
  );

  test(
    "TCPD-017 - Decrease quantity manually via input",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.inputQtt("5");
      await expect(productDetailPage.qttField).toHaveValue("5");
      await productDetailPage.inputQtt("2");
      await expect(productDetailPage.qttField).toHaveValue("2");
    },
  );

  test(
    "TCPD-018 - Decrease manual entry to minimum (0)",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.inputQtt("0");
      await expect(productDetailPage.qttField).toHaveValue("1");
    },
  );

  test(
    "TCPD-019 - Input letters and special characters",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.minusQttBtn).toBeVisible();
      await productDetailPage.inputQtt("AAA#$@##$").catch(() => false);
      console.log("System prevents non-numeric input.");
      await expect(productDetailPage.qttField).toHaveValue("1");
    },
  );

  test(
    "TCPD-020 - Add different products to cart",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.addToCartAction();
      await expect(productDetailPage.successAddtocart).toBeVisible();
      await productDetailPage.cartVerification();
    },
  );

  test(
    "TCPD-021 - Verify cart icon and total item badge",
    { tag: ["@smoke", "@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.addToCartAction();
      await expect(productDetailPage.successAddtocart).toBeVisible();
      await productDetailPage.cartVerification();
    },
  );

  test(
    "TCPD-022 - Add product with minimum quantity",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.addToCartAction();
      await expect(productDetailPage.successAddtocart).toBeVisible();
      await productDetailPage.cartVerification();
    },
  );

  test(
    "TCPD-023 - Add product with maximum quantity",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.inputQtt("99999999");
      await productDetailPage.addToCartAction();
      await expect(productDetailPage.successAddtocart).toBeVisible();
      await productDetailPage.cartVerification();
    },
  );

  test(
    "TCPD-024 - Add product with specific quantity",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.inputQtt("15");
      await productDetailPage.addToCartAction();
      await expect(productDetailPage.successAddtocart).toBeVisible();
      await productDetailPage.cartVerification();
    },
  );

  test(
    "TCPD-025 -Add to cart and refresh browser",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.addToCartAction();
      await expect(productDetailPage.successAddtocart).toBeVisible();
      await page.reload();
      await productDetailPage.cartVerification();
    },
  );

  test(
    "TCPD-026 -Add Out of Stock product to cart",
    { tag: ["@regression"] },
    async ({ outOfstock, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.addToCartAction().catch(() => false);
      await expect(productDetailPage.addtocartBtn).toBeDisabled();
    },
  );

  test(
    "TCPD-027 -Verify Success toast auto-dismisses",
    { tag: ["@regression"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtocartBtn).toBeVisible();
      await productDetailPage.addToCartAction();
      await expect(productDetailPage.successAddtocart).toBeVisible();
      await expect(productDetailPage.successAddtocart).toBeHidden({
        timeout: 10000,
      });
      await productDetailPage.cartVerification();
      await productDetailPage.cartVerification();
    },
  );

  
  

  test(
    "TCPD-031 - Add to favorites while not logged in",
    { tag: ["@regression", "@flaky"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtofavBtn).toBeVisible();
      await productDetailPage.addToFavAction();
      await expect(productDetailPage.failAddfav).toBeVisible();
    },
  );

  test(
    "TCPD-032 - Add Out of Stock to favorites (Guest)",
    { tag: ["@regression", "@flaky"] },
    async ({ outOfstock, productDetailPage, page }) => {
      await expect(productDetailPage.addtofavBtn).toBeVisible();
      await productDetailPage.addToFavAction();
      await expect(productDetailPage.failAddfav).toBeVisible();
    },
  );

  test(
    "TCPD-034 - Verify Fail toast add to favorites auto-dismisses",
    { tag: ["@regression", "@flaky"] },
    async ({ outOfstock, productDetailPage, page }) => {
      await expect(productDetailPage.addtofavBtn).toBeVisible();
      await productDetailPage.addToFavAction();
      await expect(productDetailPage.failAddfav).toBeVisible();
      await expect(productDetailPage.failAddfav).toBeHidden({ timeout: 10000 });
    },
  );

  test(
    "TCPD-035 - Verify related products display",
    { tag: ["@regression", "@flaky"] },
    async ({ productDetail, productDetailPage, page }) => {
      await expect(productDetailPage.addtofavBtn).toBeVisible();
      await expect(productDetailPage.relatedProduct).toBeVisible();
    },
  );
  
});

