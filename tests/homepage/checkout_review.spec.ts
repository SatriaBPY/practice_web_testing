import { test, expect } from "src/fixture/fixture";
import { notification } from "@validation/notofication";
import { testData_regist } from "test-data/test_data";

test.describe("Checkout Review ", () => {
  test(
    "TCCO-001 - Verify checkout page components",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.stepIndecator).toBeVisible();
      await expect(cartPage.cartItems).toBeVisible();
      await expect(cartPage.cartTotal).toBeVisible();
    },
  );

  test(
    "TCCO-002 - Verify 'Continue Shopping' button display",
    { tag: [ "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.continueBtn).toBeVisible();
      
    },
  );

  test(
    "TCCO-003 - Verify 'Proceed to Checkout' button display",
    { tag: [ "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.proceedToCheckBtn).toBeVisible();
      
    },
  );

  test(
    "TCCO-004 - Verify Step Progress Bar display",
    { tag: [ "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.stepIndecator).toBeVisible();
      
    },
  );

  test(
    "TCCO-005 - Increase quantity to specific amount",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.verifyTotalPriceAnditem()
      await cartPage.qttUpdate('20', 'first')
      await expect(cartPage.notificationqtt).toBeVisible({timeout: 10000})
      await cartPage.verifyTotalPriceAnditem()
      
    },
  );

  test(
    "TCCO-006 - Decrease quantity to specific amount",
    { tag: ["@smoke",  "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.qttUpdate('5', 'first')
      await cartPage.verifyTotalPriceAnditem()
      await cartPage.qttUpdate('3', "first")
      await expect(cartPage.notificationqtt.first()).toBeVisible({timeout: 10000})
      await cartPage.verifyTotalPriceAnditem()
      
    },
  );

  test(
    "TCCO-007 - Input quantity below minimum limit",
    { tag: [ "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.verifyTotalPriceAnditem()
      await cartPage.qttUpdate('0', 'first')
      await cartPage.verifyTotalPriceAnditem()
      
    },
  );

  test(
    "TCCO-008 - Input quantity above maximum limit",
    { tag: [ "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.verifyTotalPriceAnditem()
      await cartPage.qttUpdate('999999999', 'first')
      await expect(cartPage.notificationqtt).toBeVisible({timeout: 10000})
      await cartPage.verifyTotalPriceAnditem()
      
    },
  );

  test(
    "TCCO-009 - Input quantity with letters/special characters",
    { tag: [ "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.verifyTotalPriceAnditem()
      await cartPage.qttUpdate('$%#@##', 'first').catch(()=>false)
      await cartPage.verifyTotalPriceAnditem()
      
    },
  );

  test(
    "TCCO-011 - Delete item with minimum quantity",
    { tag: ["@smoke",  "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.verifyTotalPriceAnditem()
      await cartPage.deleteProduct('first')
      await expect(cartPage.notificationDeleted).toBeVisible({timeout: 10000})
      
    },
  );

  test(
    "TCCO-013 - Access checkout URL with items in cart",
    { tag: [ "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();``
    },
  );

  test(
    "TCCO-014 - Access checkout URL with empty cart",
    { tag: [ "@regression"] },
    async ({  gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).not.toBeVisible();
    },
  );

  test(
    "TCCO-015 - Continue shopping from cart page",
    { tag: ["@smoke",  "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page, homePage }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.continueShoppingAction();
      await expect(homePage.firstProductCard).toBeVisible();
    },
  );

  test(
    "TCCO-016 - Proceed to next step from cart page",
    { tag: ["@smoke",  "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await expect(cartPage.guestTab).toBeVisible();
    },
  );

  test(
    "TCCO-017 - Redirect guest to Sign-In step",
    { tag: ["@smoke", "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await expect(cartPage.emailField).toBeVisible();
      await expect(cartPage.passwordField).toBeVisible();
    },
  );

  test(
    "TCCO-018 - Verify tab components in Sign-In step",
    { tag: ["@smoke",  "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await expect(cartPage.guestTab).toBeVisible();
      await expect(cartPage.signinTab).toBeVisible();
    },
  );

  test(
    "TCCO-019 - Verify 'Sign-In' tab form fields",
    { tag: [ "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await expect(cartPage.emailField).toBeVisible();
      await expect(cartPage.passwordField).toBeVisible();
    },
  );

  test(
    "TCCO-020 - Verify 'Continue as Guest' tab form fields",
    { tag: ["@smoke",  "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.tapGuestTab();
      await expect(cartPage.emailFieldGuest).toBeVisible();
      await expect(cartPage.firstNameField).toBeVisible();
      await expect(cartPage.lastNameField).toBeVisible();
      await expect(cartPage.submitBtn).toBeVisible();
    },
  );

  
  test(
    "TCCO-021 - Successful login during checkout",
    { tag: [ "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.emailAddressFill();
      await cartPage.passwordFill();
      await cartPage.signinBtnClick();
      await cartPage.welcomeMessage("sign-in");
    },
  );

  
  test(
    "TCCO-023 - Failed login during checkout",
    { tag: [ "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.emailAddressFill("invalid@mail.com");
      await cartPage.passwordFill("invalid_password");
      await cartPage.signinBtnClick();
      await expect(cartPage.errorSignIn).toBeVisible()
    },
  );

  test(
    "TCCO-024 - Successful 'Continue as Guest' checkout",
    { tag: ["@smoke", "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.tapGuestTab();
      await expect(cartPage.emailFieldGuest).toBeVisible();
      await cartPage.emailAddressFillGuest(testData_regist.email);
      await cartPage.firstNameFillGuest(testData_regist.first_name);
      await cartPage.lastNameFillGuest(testData_regist.last_name);
      await cartPage.submitBtnClickGuest();
      await cartPage.welcomeMessage("guest")
    },
  );

  test(
    "TCCO-025 - Input special characters/script in First Name",
    { tag: [ "@regression", "@bug"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.tapGuestTab();
      await expect(cartPage.emailFieldGuest).toBeVisible();
      await cartPage.emailAddressFillGuest(testData_regist.email);
      await cartPage.firstNameFillGuest('#$#!@#@');
      await cartPage.lastNameFillGuest(testData_regist.last_name);
      await cartPage.submitBtnClickGuest();
      await expect(cartPage.messagesSignGuest).not.toBeVisible();
    },
  );

  test(
    "TCCO-026 - Input special characters/script in Last Name",
    { tag: [ "@regression", "@bug"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.tapGuestTab();
      await expect(cartPage.emailFieldGuest).toBeVisible();
      await cartPage.emailAddressFillGuest(testData_regist.email);
      await cartPage.firstNameFillGuest(testData_regist.first_name);
      await cartPage.lastNameFillGuest('#$#!@#@');
      await cartPage.submitBtnClickGuest();
      await expect(cartPage.messagesSignGuest).not.toBeVisible();
    },
  );

  test(
    "TCCO-027 - Input invalid email format",
    { tag: [ "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.tapGuestTab();
      await expect(cartPage.emailFieldGuest).toBeVisible();
      await cartPage.emailAddressFillGuest('invalid_format');
      await cartPage.firstNameFillGuest(testData_regist.first_name);
      await cartPage.lastNameFillGuest(testData_regist.last_name);
      await cartPage.submitBtnClickGuest();
      await expect(cartPage.errorMailMsgGuest).toBeVisible();
    },
  );

  test(
    "TCCO-028 - Leave all guest fields empty",
    { tag: [ "@regression"] },
    async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
      await expect(cartPage.qttField).toBeVisible();
      await cartPage.tapProceedToCheckout();
      await cartPage.tapGuestTab();
      await expect(cartPage.emailFieldGuest).toBeVisible();
      await cartPage.submitBtnClickGuest();
      await expect(cartPage.errorMailMsgGuest).toBeVisible();
      await expect(cartPage.errorFirstnameGuest).toBeVisible();
      await expect(cartPage.errorLastnameGuest).toBeVisible();
      
    },
  );




  
  
  
  test.describe('multiple product cart', () => {
    test.use({ extraProduct: true });
    test(
      "TCCO-010 - Update quantity for multiple different products",
      { tag: [ "@regression"] },
      async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
        await expect(cartPage.qttField.first()).toBeVisible();
        await cartPage.verifyTotalPriceAnditem()
        await cartPage.qttUpdate('2', 'first')
        await cartPage.qttUpdate('2', 1)
        await cartPage.verifyTotalPriceAnditem()
        
      },
    );

    test(
      "TCCO-012 - Delete one product from multiple items",
      { tag: [ "@regression"] },
      async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
        await expect(cartPage.qttField.first()).toBeVisible();
        await cartPage.verifyTotalPriceAnditem()
        await cartPage.deleteProduct(1);
        await expect(cartPage.notificationDeleted).toBeVisible();
        await cartPage.verifyTotalPriceAnditem()
        
      },
    );
  });

  test.describe.serial("Authenticated Tests", () => {
    test.use({ needsAuth: true });
    test(
      "TCCO-022 - Proceed after login during checkout",
      { tag: [ "@regression", "@flaky"] },
      async ({ page, addProductTocart, gotoCheckout, cartPage }) => {
        await page.context().storageState({ path: `auth/state/storageState.json` });
        await page.reload();
        await expect(cartPage.qttField).toBeVisible();
        await cartPage.tapProceedToCheckout();
        await cartPage.welcomeMessage('sign-in')
      },
    );

    test(
      "TCCO-029 - Checkout with previously logged-in user",
      { tag: [ "@regression"] },
      async ({  addProductTocart, gotoCheckout, cartPage, page }) => {
        await expect(cartPage.qttField).toBeVisible();
        await cartPage.tapProceedToCheckout();
        await cartPage.welcomeMessage('sign-in')
        await cartPage.continueBillingAddressSignin();
      },
    );
  });
})