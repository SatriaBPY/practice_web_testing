import { test, expect } from "src/fixture/fixture";
import { notification } from "@validation/notofication";
import {
  testData_regist,
  billing_address,
  bankDetail,
} from "test-data/test_data";

test.describe.serial("E2E - Testing", () => {
  test(
    "User is in login page and Redirect to home page",
    { tag: ["@e2e", "@regression"] },
    async ({ sharedPage, loginSharedPage, homePageShared }) => {
      await test.step("Navigate to login page", async () => {
        await loginSharedPage.openLoginPage();
        await expect(loginSharedPage.emailField).toBeVisible();
        await expect(loginSharedPage.passwordField).toBeVisible();
        await expect(loginSharedPage.loginBtn).toBeVisible();
      });

      await test.step("Login with valid credentials", async () => {
        await loginSharedPage.login("default");
        await expect(loginSharedPage.userPage).toBeVisible();
      });

      await test.step("Redirect to home page", async () => {
        await loginSharedPage.gotoHomepPage();
        await expect(homePageShared.productTitle).toBeVisible();
      });
    },
  );

  test(
    "User is in Home Page and choose a product",
    { tag: ["@e2e", "@regression"] },
    async ({
      sharedPage,
      loginSharedPage,
      homePageShared,
      productDetailPageShared,
      cartPageShared,
    }) => {
      await test.step("Click product", async () => {
        await homePageShared.firstProductCard.click();
      });

      await test.step("User is Redirect to product detail page", async () => {
        await expect(productDetailPageShared.titleProduct).toBeVisible();
        await expect(productDetailPageShared.priceProduct).toBeVisible();
        await expect(productDetailPageShared.co2rating).toBeVisible();
        await expect(productDetailPageShared.description).toBeVisible();
      });

      await test.step("User add product to cart", async () => {
        await productDetailPageShared.addToCartAction();
        await expect(productDetailPageShared.successAddtocart).toBeVisible();
        await productDetailPageShared.cartVerification();
      });

      await test.step("User add product to cart", async () => {
        await productDetailPageShared.addToCartAction();
        await expect(productDetailPageShared.successAddtocart).toBeVisible();
        await productDetailPageShared.cartVerification();
      });
      await test.step("User go to cart page", async () => {
        await productDetailPageShared.gotoCartPage();
        await expect(cartPageShared.qttField).toBeVisible();
      });
    },
  );

  test(
    "User is in Cart Page",
    { tag: ["@e2e", "@regression"] },
    async ({
      sharedPage,
      loginSharedPage,
      homePageShared,
      productDetailPageShared,
      cartPageShared,
    }) => {
      await test.step("Add quantity", async () => {
        await cartPageShared.qttField.fill("3");
        await cartPageShared.verifyTotalPriceAnditem();
      });

      await test.step("User goto next step 2 - Login", async () => {
        await cartPageShared.proceedToCheckBtn.click();
        await cartPageShared.welcomeMessage("sign-in");
      });

      await test.step("User goto next step 3 - Billing Address", async () => {
        await expect(cartPageShared.procced2Signin).toBeVisible();
        await cartPageShared.procced2Signin.click();
      });

      await test.step("User fill Billing Address with valid data", async () => {
        await expect(cartPageShared.countryOption).toBeVisible();
        await cartPageShared.countrySelect("NL");
        await cartPageShared.postalCodeFill(billing_address.postal_code);
        await cartPageShared.houseNumberFill(billing_address.house_number);
        await cartPageShared.streetField.fill(billing_address.Street);
        await cartPageShared.cityField.fill(billing_address.city);
        await cartPageShared.stateFill(billing_address.stat_40_char);
        await cartPageShared.submitBtnCheckoutClick();
      });

      await test.step("User goto next step 4 - Payment", async () => {
        await expect(cartPageShared.paymentMethodDropdown).toBeVisible();
      });
      await test.step("User Chose Payment Method (Bank Transfer)", async () => {
        await cartPageShared.paymentMethodSelect("BANK TRANSFER");
      });
      await test.step("User fill Bank Transfer Details", async () => {
        await expect(cartPageShared.bankNameField).toBeVisible();
        await cartPageShared.bankNameField.fill(bankDetail.bank_name);
        await cartPageShared.accountNameField.fill(bankDetail.account_name);
        await cartPageShared.accoutNumbField.fill(bankDetail.account_number);
        await expect(cartPageShared.confirmBtn).toBeEnabled();
      });
      await test.step("User finish Transaction", async () => {
        await cartPageShared.tapFinishBtn();
        await expect(cartPageShared.succesMsgPayment).toBeVisible();
      });
      await test.step("User verify invoice number", async () => {
        await cartPageShared.tapFinishBtn();
        await cartPageShared.verifyNotification(notification.Cart.succes_order);
        await cartPageShared.invoiceNumberText();
        await cartPageShared.cartIsEmpty();
      });
    },
  );
});
