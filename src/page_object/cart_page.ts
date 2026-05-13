import { expect, Page } from "@playwright/test";
import { BasePage } from "./base_page";
import { notification } from "@validation/notofication";
import { country, paymentOption } from "../types/options.types";
import {
  testData_regist,
  testDataValid_register,
  billing_address,
} from "test-data/test_data";
import { EnvironmentManager } from "@helper/utils";
import { NavBar } from "@component/navbar";

const {
  admin_email,
  admin_password,
  validLogin,
  validPassword,
  disableLogin,
  disablePassword,
} = EnvironmentManager.getCredentials();

export default class CartPage extends BasePage {
  private readonly navBar: NavBar;
  constructor(page: Page) {
    super(page);
    this.navBar = new NavBar(page);
  }

  /*
    Checkout - Cart 1st Step
  */
  readonly stepIndecator = this.page.locator(".steps-4");
  readonly cartItems = this.page.locator(".product-title");
  readonly qttField = this.page.locator('[data-test="product-quantity"]');
  readonly price = this.page.locator('[data-test="product-price"]');
  readonly totalPrice = this.page.locator('[data-test="line-price"]');
  readonly cartTotal = this.page.locator('[data-test="cart-total"]');
  readonly continueBtn = this.page.locator('[data-test="continue-shopping"]');
  readonly proceedToCheckBtn = this.page.locator('[data-test="proceed-1"]');

  private deleteButton(option: "first" | number) {
    if (option === "first") {
      return this.page.locator(".btn-danger").first();
    }
    return this.page.locator(".btn-danger").nth(option);
    ``;
  }

  private qttFields(option: "first" | number) {
    if (option === "first") {
      return this.qttField.first();
    }
    return this.qttField.nth(option);
  }

  get notificationqtt() {
    return this.page.getByRole("alert", {
      name: notification.Cart.product_qtt_updated,
    });
  }

  get notificationDeleted() {
    return this.page.getByRole("alert", {
      name: notification.Cart.product_deleted,
    });
  }

  /*
    Checkout - Sign IN 2nd step
  */

  //tab component
  readonly signinTab = this.page.getByRole("tab", { name: "Sign in" });
  readonly guestTab = this.page.getByRole("tab", { name: "Continue as Guest" });

  //sign-in form
  readonly emailField = this.page.locator('[data-test="email"]');
  readonly passwordField = this.page.locator('[data-test="password"]');
  readonly signinBtn = this.page.locator('[data-test="login-submit"]');
  readonly procced2Signin = this.page.locator('[data-test="proceed-2"]');

  get errorMsgPass() {
    return this.page.locator('[data-test="password-error"]');
  }

  get errorMsgMail() {
    return this.page.locator('[data-test="email-error"]');
  }

  get errorSignIn() {
    return this.page.locator('[data-test="login-error"]');
  }

  //continue as guset form
  readonly emailFieldGuest = this.page.locator('[data-test="guest-email"]');
  readonly firstNameField = this.page.locator('[data-test="guest-first-name"]');
  readonly lastNameField = this.page.locator('[data-test="guest-last-name"]');
  readonly submitBtn = this.page.locator('[data-test="guest-submit"]');
  readonly proceed2Login = this.page.locator('[data-test="proceed-2"]');

  readonly actualOptions = this.page.locator(
    '[data-test="payment-method"] option',
  );

  private messageSignGuest(validation: string) {
    return this.page.getByText(`Continuing as guest: ${validation}`);
  }

  get messagesSignGuest() {
    return this.page.getByText(`Continuing as guest: `);
  }

  private messageSign(firstname: string, lastname: string) {
    return this.page.getByText(`Hello ${firstname} ${lastname}, you are`);
  }

  readonly proceedTocheck2guest = this.page.locator(
    '[data-test="proceed-2-guest"]',
  );

  get errorMailMsgGuest() {
    return this.page.locator('[data-test="guest-email-error"]');
  }

  get errorFirstnameGuest() {
    return this.page.locator('[data-test="guest-first-name-error"]');
  }

  get errorLastnameGuest() {
    return this.page.locator('[data-test="guest-last-name-error"]');
  }

  /*

    Checkout - Billing address step 3

  */

  readonly countryOption = this.page.locator('[data-test="country"]');
  readonly postalCodeField = this.page.locator('[data-test="postal_code"]');
  readonly houseNumberField = this.page.locator('[data-test="house_number"]');
  readonly postalcodeLookup = this.page.locator(
    '[data-test="postcode-lookup-loading"]',
  );
  readonly streetField = this.page.locator('[data-test="street"]');
  readonly streetFieldError = this.page.locator('[data-test="street-error"]');
  readonly cityField = this.page.locator('[data-test="city"]');
  readonly stateField = this.page.locator('[data-test="state"]');
  readonly submitBtnCheckout = this.page.locator('[data-test="proceed-3"]');

  /*
    Checkout - Payment step 4
  */

  readonly paymentMethodDropdown = this.page.locator(
    '[data-test="payment-method"]',
  );
  readonly bankNameField = this.page.locator('[data-test="bank_name"]');
  readonly accountNameField = this.page.locator('[data-test="account_name"]');
  readonly accoutNumbField = this.page.locator('[data-test="account_number"]');
  readonly confirmBtn = this.page.locator('[data-test="finish"]');
  readonly errorMsg = this.page.locator('[data-test="payment-error-message"]');
  get invoiceNumber() {
    return this.page.locator('[id="order-confirmation"]')
  }
  get errorMsgBankNameSpecialChar() {
    return this.page
      .locator("form")
      .filter({ hasText: "Payment MethodChoose your" })
      .locator("div")
      .nth(2);
  }
  get errMsgAccountSpecialChar() {
    return this.page
      .locator("form")
      .filter({ hasText: "Payment MethodChoose your" })
      .locator("div")
      .nth(2);
  }
  get errMsgNumber() {
    return this.page
      .locator("app-payment form div")
      .filter({ hasText: "Account number must be" })
      .nth(1);
  }
  get succesMsgPayment() {
    return this.page.locator('[data-test="payment-success-message"]');
  }

  /*

      METHODS

  */

  private notificationBytext(text: string) {
    return this.page.getByText(text);
  }

  async verifyNotification(text: string) {
    await expect(this.notificationBytext(text)).toBeVisible();
  }

  async continueShoppingAction() {
    await expect(this.continueBtn).toBeVisible();
    Promise.all([this.page.waitForNavigation(), this.continueBtn.click()]);
  }

  async qttUpdate(qtt: string, option: "first" | number) {
    const qttField = this.qttFields(option);
    await qttField.waitFor({ state: "visible" });
    await qttField.fill(qtt);
    await this.page.keyboard.press("Tab");
  }

  async verifyTotalPriceAnditem() {
    await expect(this.totalPrice.first()).toBeVisible();
    await expect(this.cartTotal.first()).toBeVisible();
    const totalPriceText = await this.totalPrice.first().textContent();
    const cartTotalText = await this.cartTotal.first().textContent();
    console.log(
      `Total Item: ${cartTotalText} | Total Price = ${totalPriceText}`,
    );
  }

  async deleteProduct(option: "first" | number) {
    const deleteButton = this.deleteButton(option);
    await deleteButton.waitFor({ state: "visible" });
    await deleteButton.click();
  }

  async tapProceedToCheckout() {
    await this.proceedToCheckBtn.waitFor({ state: "visible" });
    await this.proceedToCheckBtn.click();
  }

  /*
    Step 2
  */

  //SIGN-IN
  //
  async tapSigninTab() {
    await this.signinTab.waitFor({ state: "visible" });
    await this.signinBtn.click();
  }

  async emailAddressFill(email?: string) {
    if (email) {
      await this.emailField.fill(email);
    } else {
      await this.emailField.fill(validLogin || "");
    }
  }

  async passwordFill(password?: string) {
    if (password) {
      await this.passwordField.fill(password);
    } else {
      await this.passwordField.fill(validPassword || "");
    }
  }

  async signinBtnClick() {
    await this.signinBtn.waitFor({ state: "visible" });
    await this.signinBtn.click();
  }

  async continueBillingAddressSignin() {
    await this.proceed2Login.waitFor({ state: "visible" });
    await this.proceed2Login.click();
  }

  //AS Guest
  async tapGuestTab() {
    await this.guestTab.waitFor({ state: "visible" });
    await this.guestTab.click();
  }

  async emailAddressFillGuest(email: string) {
    await this.emailFieldGuest.fill(email);
  }

  async firstNameFillGuest(firstname: string) {
    await this.firstNameField.fill(firstname);
  }

  async lastNameFillGuest(lastname: string) {
    await this.lastNameField.fill(lastname);
  }

  async submitBtnClickGuest() {
    await this.submitBtn.waitFor({ state: "visible" });
    await this.submitBtn.click();
  }

  async welcomeMessage(option: "sign-in" | "guest", firstname?: string) {
    switch (option) {
      case "sign-in":
        return this.messageSign(
          testDataValid_register.first_name,
          testDataValid_register.last_name ?? "",
        );
        break;
      case "guest":
        return this.messageSignGuest(firstname || "");
        break;
    }
  }
  async continueBillingAddressGuest() {
    await this.proceedTocheck2guest.waitFor({ state: "visible" });
    await this.proceedTocheck2guest.click();
  }

  async continueToBillingAddressGuest() {
    await expect(this.qttField).toBeVisible();
    await this.tapProceedToCheckout();
    await this.tapGuestTab();
    await expect(this.emailFieldGuest).toBeVisible();
    await this.emailAddressFillGuest(testData_regist.email);
    await this.firstNameFillGuest(testData_regist.first_name);
    await this.lastNameFillGuest(testData_regist.last_name);
    await this.submitBtnClickGuest();
    await this.welcomeMessage("guest");
    await this.continueBillingAddressGuest();
  }

  async continueToPayment() {
    await expect(this.countryOption).toBeVisible();
    await this.countrySelect("NL");
    await this.postalCodeFill(billing_address.postal_code);
    await this.houseNumberFill(billing_address.house_number);
    await this.streetField.fill(billing_address.Street);
    await this.cityField.fill(billing_address.city);
    await this.stateField.fill(billing_address.state);
    await this.submitBtnCheckoutClick();
    await expect(this.paymentMethodDropdown).toBeVisible();
  }
  /*
    Step 3
  */

  async countrySelect(option: country) {
    await this.countryOption.selectOption(option);
    await this.page.waitForTimeout(500);
  }

  async postalCodeFill(postalCode: string) {
    await this.postalCodeField.fill(postalCode);
  }

  async houseNumberFill(houseNumber: string) {
    await this.houseNumberField.fill(houseNumber);
  }

  async stateFill(state: string) {
    await this.stateField.fill(state);
  }

  async submitBtnCheckoutClick() {
    await this.submitBtnCheckout.waitFor({ state: "visible" });
    await this.submitBtnCheckout.click();
  }

  async verifyCountryOptionText(text: string) {
    await expect(this.countryOption.locator("option:checked")).toHaveText(text);
  }
  /*
    Step 4
  */

  async paymentMethodSelect(option: paymentOption) {
    const maping: Record<paymentOption, string> = {
      "BANK TRANSFER": "bank-transfer",
      COD: "cash-on-delivery",
      CC: "credit-card",
      Payleter: "buy-now-pay-later",
      "GIFT CARD": "gift-card",
    };
    await this.paymentMethodDropdown.selectOption(maping[option]);
  }

  async tapFinishBtn() {
    await this.confirmBtn.waitFor({ state: "visible" });
    await this.confirmBtn.click();
  }

  async invoiceNumberText() {
    const text = await this.invoiceNumber.textContent();
    const data = text?.split("is ")[1].replace(".", "");
    console.log(`Order Success invoice number is: ${data}`)
  }

  async cartIsEmpty() {
    await expect(this.navBar.cartIcon).toBeHidden();
  }

 
  
}
