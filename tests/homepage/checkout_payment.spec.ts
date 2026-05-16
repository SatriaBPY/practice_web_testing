import { test, expect } from "src/fixture/fixture";
import { notification } from "@validation/notofication";
import { bankDetail } from "test-data/test_data";
import { expectedMethods } from "@validation/dropdown";



test.describe("Checkout - Payement ", () => {

  test(
    "TCCP-001 - Verify payment dropdown",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('guest')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
    },
  );

  test(
    "TCCP-002 - Verify payment dropdown options",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToBillingAddressGuest()
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await expect(cartPage.actualOptions).toHaveText(expectedMethods)
    },
  );

  test(
    "TCCP-003 - Select Bank transfer option",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      // await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToBillingAddressGuest()
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await expect(cartPage.accountNameField).toBeVisible();
      await expect(cartPage.accoutNumbField).toBeVisible();
    },
  );

  test(
    "TCCP-004 - Input bank name field with valid data",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name);
      await expect(cartPage.bankNameField).toHaveValue(bankDetail.bank_name);
    },
  );

  test(
    "TCCP-005 - Input bank name field with numbers and special characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name_special_char);
      await expect(cartPage.errorMsgBankNameSpecialChar).toContainText(notification.Cart.err_bank_name_special_char);
    },
  );

  test(
    "TCCP-006 - Input bank name field with valid data containing spaces",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name_space);
      await expect(cartPage.bankNameField).toHaveValue(bankDetail.bank_name_space);
    },
  );

  test(
    "TCCP-007 - Clear bank name field after inputting data",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name_space);
      await cartPage.bankNameField.clear();
      await expect(cartPage.bankNameField).toHaveValue("");
    },
  );

  test(
    "TCCP-008 - Input account name field with valid data",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.accountNameField.fill(bankDetail.account_name);
      await expect(cartPage.accountNameField).toHaveValue(bankDetail.account_name);
    },
  );

  test(
    "TCCP-009 - Input account name field with valid data containing Periods; Apostrophes; Hyphens",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.accountNameField.fill(bankDetail.account_name_special_char);
      await expect(cartPage.accountNameField).toHaveValue(bankDetail.account_name_special_char);
    },
  );

  test(
    "TCCP-010 - Input account name fields with valid data containing numbers",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.accountNameField.fill(bankDetail.account_name_number);
      await expect(cartPage.accountNameField).toHaveValue(bankDetail.account_name_number);
    },
  );

  test(
    "TCCP-011 - Input account name fields with valid data containing special characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.accountNameField.fill(bankDetail.account_name_special);
      await expect(cartPage.errMsgAccountSpecialChar).toContainText(notification.Cart.err_account_name_special_char)
    },
  );

  test(
    "TCCP-012 - Input Account Number fields with valid data",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.accoutNumbField.fill(bankDetail.account_number);
      await expect(cartPage.accoutNumbField).toHaveValue(bankDetail.account_number);
    },
  );

  test(
    "TCCP-013 - Input Account Number fields with data containing special characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.accoutNumbField.fill(bankDetail.account_number_special_char);
      await expect(cartPage.errMsgNumber).toContainText(notification.Cart.err_account_number_special_char)
    },
  );

  test(
    "TCCP-014 - Input Account Number fields with data containing letters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.accoutNumbField.fill(bankDetail.account_number_wirh_leter);
      await expect(cartPage.errMsgNumber).toContainText(notification.Cart.err_account_number_special_char)
    },
  );

  test(
    "TCCP-015 - Confirm button enabled when all data is filled correctly",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name);
      await cartPage.accountNameField.fill(bankDetail.account_name);
      await cartPage.accoutNumbField.fill(bankDetail.account_number)
      await expect(cartPage.confirmBtn).toBeEnabled();
    },
  );

  test(
    "TCCP-016 - Confirm button disabled when any data is not filled correctly",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name);
      await cartPage.accountNameField.fill(bankDetail.account_name);
      await cartPage.accoutNumbField.fill(bankDetail.account_number_special_char)
      await expect(cartPage.confirmBtn).toBeDisabled();
    },
  );

  test(
    "TCCP-017 - Verify successful payment messagey",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name);
      await cartPage.accountNameField.fill(bankDetail.account_name);
      await cartPage.accoutNumbField.fill(bankDetail.account_number)
      await expect(cartPage.confirmBtn).toBeEnabled();
      await cartPage.tapFinishBtn();
      await expect(cartPage.succesMsgPayment).toBeVisible();
      await expect(cartPage.succesMsgPayment).toHaveText(notification.Cart.payment_success)
    },
  );

  test(
    "TCCP-018 - Verify invoice generated correctly when payment process is successful",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name);
      await cartPage.accountNameField.fill(bankDetail.account_name);
      await cartPage.accoutNumbField.fill(bankDetail.account_number)
      await expect(cartPage.confirmBtn).toBeEnabled();
      await cartPage.tapFinishBtn();
      await expect(cartPage.succesMsgPayment).toBeVisible();
      await cartPage.tapFinishBtn();
      await cartPage.verifyNotification(notification.Cart.succes_order)
      await cartPage.invoiceNumberText();
      
    },
  );

  test(
    "TCCP-019 - Verify cart is empty after successful payment",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest()
      // await cartPage.tapProceedToCheckout();
      // await cartPage.welcomeMessage('sign-in')
      // await cartPage.continueBillingAddressSignin();
      await cartPage.continueToPayment();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
      await cartPage.paymentMethodSelect('BANK TRANSFER');
      await expect(cartPage.bankNameField).toBeVisible();
      await cartPage.bankNameField.fill(bankDetail.bank_name);
      await cartPage.accountNameField.fill(bankDetail.account_name);
      await cartPage.accoutNumbField.fill(bankDetail.account_number)
      await expect(cartPage.confirmBtn).toBeEnabled();
      await cartPage.tapFinishBtn();
      await expect(cartPage.succesMsgPayment).toBeVisible();
      await cartPage.tapFinishBtn();
      await cartPage.verifyNotification(notification.Cart.succes_order)
      await cartPage.invoiceNumberText();
      await cartPage.cartIsEmpty();
      
    },
  );

  test.describe.serial("Authenticated Tests", () => {
    test.use({ needsAuth: true });
  
    test(
      "TCCP-020 - Verify cart is empty after successful payment",
      { tag: ["@smoke", "@regression"] },
      async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
        // await cartPage.continueToBillingAddressGuest()
        await cartPage.tapProceedToCheckout();
        await cartPage.welcomeMessage('sign-in')
        await cartPage.continueBillingAddressSignin();
        await cartPage.continueToPayment();
        await expect(cartPage.paymentMethodDropdown).toBeVisible();
        await cartPage.paymentMethodSelect('BANK TRANSFER');
        await expect(cartPage.bankNameField).toBeVisible();
        await cartPage.bankNameField.fill(bankDetail.bank_name);
        await cartPage.accountNameField.fill(bankDetail.account_name);
        await cartPage.accoutNumbField.fill(bankDetail.account_number)
        await expect(cartPage.confirmBtn).toBeEnabled();
        await cartPage.tapFinishBtn();
        await expect(cartPage.succesMsgPayment).toBeVisible();
        await cartPage.tapFinishBtn();
        await cartPage.verifyNotification(notification.Cart.succes_order)
        await cartPage.invoiceNumberText();
        await cartPage.cartIsEmpty();
        
      },
    );
  });

  

});
