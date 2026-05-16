import { test, expect } from "src/fixture/fixture";
import { notification } from "@validation/notofication";
import { testData_regist, billing_address } from "test-data/test_data";

test.describe("Checkout Billing Address", () => {
  test(
    "TCCB-001 - Verify billing address components",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await expect(cartPage.postalCodeField).toBeVisible();
      await expect(cartPage.houseNumberField).toBeVisible();
      await expect(cartPage.stateField).toBeVisible();
      await expect(cartPage.streetField).toBeVisible();
      await expect(cartPage.cityField).toBeVisible();
    },
  );

  test(
    "TCCB-002 - Verify default dropdown display",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await expect(cartPage.countryOption).toHaveValue("");
    },
  );

  test(
    "TCCB-003 - Ensure dropdown Country contains correct options",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("ID");
      await cartPage.verifyCountryOptionText("Indonesia");
    },
  );

  test(
    "TCCB-004 - Select Country based on available options",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.verifyCountryOptionText("Netherlands (the)");
    },
  );

  test(
    "TCCB-005 - Change options after successful selection",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.verifyCountryOptionText("Netherlands (the)");
      await cartPage.countrySelect("ID");
      await cartPage.verifyCountryOptionText("Indonesia");
    },
  );

  test(
    "TCCB-006 - Input postal code with valid data",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await expect(cartPage.postalCodeField).toHaveValue(
        billing_address.postal_code,
      );
    },
  );

  test(
    "TCCB-007 - Input postal code with alphanumeric combination",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code_combination);
      await expect(cartPage.postalCodeField).toHaveValue(
        billing_address.postal_code_combination,
      );
    },
  );

  test(
    "TCCB-008 - Input postal code with 10 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code_10_Char);
      await expect(cartPage.postalCodeField).toHaveValue(
        billing_address.postal_code_10_Char,
      );
    },
  );

  test(
    "TCCB-009 - Input postal code more than 10 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code_11_char);
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-010 - Input house number with numbers",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await expect(cartPage.houseNumberField).toHaveValue(
        billing_address.house_number,
      );
    },
  );

  test(
    "TCCB-011 - Input House number with alphanumeric combination",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number_combination);
      await expect(cartPage.houseNumberField).toHaveValue(
        billing_address.house_number_combination,
      );
    },
  );

  test(
    "TCCB-012 - Input House number with 10 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number_10_Char);
      await expect(cartPage.houseNumberField).toHaveValue(
        billing_address.house_number_10_Char,
      );
    },
  );

  test(
    "TCCB-013 - Input House number more than 10 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number_11_char);
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-014 - Input Street field with valid data",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.Street);
      await expect(cartPage.streetField).toHaveValue(billing_address.Street);
    },
  );

  test(
    "TCCB-015 - Input Street field with 70 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.street_70_char);
      await expect(cartPage.streetField).toHaveValue(
        billing_address.street_70_char,
      );
    },
  );

  test(
    "TCCB-016 - Input Street field more than 70 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.street_71_char);
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-017 - Input Street field more than 70 characters – verify error message is shown",
    { tag: ["@regression", "@bug"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.street_71_char);
      await expect(cartPage.streetFieldError).toBeVisible();
    },
  );

  test(
    "TCCB-018 - Input City field with valid data",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.Street);
      await cartPage.cityField.fill(billing_address.city);
      await expect(cartPage.cityField).toHaveValue(billing_address.city);
    },
  );

  test(
    "TCCB-019 - Input City field with 40 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.Street);
      await cartPage.cityField.fill(billing_address.city_40_char);
      await expect(cartPage.cityField).toHaveValue(
        billing_address.city_40_char,
      );
    },
  );

  test(
    "TCCB-020 - Input City field more than 40 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.Street);
      await cartPage.cityField.fill(billing_address.city_41_char);
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-021 - Input State field with valid data",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.Street);
      await cartPage.cityField.fill(billing_address.city);
      await cartPage.stateFill(billing_address.state);
      await expect(cartPage.stateField).toHaveValue(billing_address.state);
    },
  );

  test(
    "TCCB-022 - Input State field with 40 characters",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await expect(cartPage.postalcodeLookup).toBeVisible().catch(() => false);
      await page.waitForTimeout(1000);
      await cartPage.streetField.fill(billing_address.Street);
      await cartPage.cityField.fill(billing_address.city);
      await cartPage.stateFill(billing_address.stat_40_char);
      await expect(cartPage.stateField).toHaveValue(
        billing_address.stat_40_char,
      );
    },
  );

  test(
    "TCCB-023 - Input State field more than 40 characters",
    { tag: ["@regression", "@flaky"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await expect(cartPage.postalcodeLookup).toBeVisible().catch(() => false);
      await page.waitForTimeout(1000);
      await cartPage.streetField.fill(billing_address.Street);
      await cartPage.cityField.fill(billing_address.city);
      await cartPage.stateFill(billing_address.stat_41_char);
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-024 - Verify Proceed button is inactive when all fields are emptys",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-025 - Verify Proceed button is inactive when one data is invalid",
    { tag: ["@regression", "@flaky"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.Street);
      await page.waitForTimeout(2000);
      await cartPage.cityField.fill(billing_address.city_41_char);
      await cartPage.stateFill(billing_address.state);
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-026 - Verify Proceed button is inactive when one field is empty",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await expect(cartPage.postalcodeLookup).toBeVisible().catch(() => false);
      await page.waitForTimeout(1111)
      await cartPage.streetField.clear();
      await cartPage.cityField.fill(billing_address.city);
      await cartPage.stateFill(billing_address.state);
      await expect(cartPage.submitBtnCheckout).toBeDisabled();
    },
  );

  test(
    "TCCB-027 - Ensure auto-fill for Street City State with valid data",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await page.keyboard.press("Tab");
      await expect(cartPage.postalcodeLookup).toBeVisible();
      await expect(cartPage.streetField).toHaveValue(billing_address.Street);
      await expect(cartPage.cityField).toHaveValue(billing_address.city);
      await expect(cartPage.stateField).toHaveValue(billing_address.state);
    },
  );

  test(
    "TCCB-028 - Ensure auto-fill for Street City State with valid data",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number_11_char);
      await page.keyboard.press("Tab");
      await expect(cartPage.postalcodeLookup).toBeVisible();
      await expect(cartPage.streetField).not.toHaveValue(
        billing_address.Street,
      );
      await expect(cartPage.cityField).not.toHaveValue(billing_address.city);
      await expect(cartPage.stateField).not.toHaveValue(billing_address.state);
    },
  );

  test(
    "TCCB-029 - Navigate to next step after manual valid input",
    { tag: ["@smoke", "@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await cartPage.streetField.fill(billing_address.Street);
      await cartPage.cityField.fill(billing_address.city);
      await cartPage.stateFill(billing_address.stat_40_char);
      await cartPage.submitBtnCheckoutClick();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
    },
  );

  test(
    "TCCB-030 - Navigate to next step after automatic valid input",
    { tag: ["@regression"] },
    async ({ addProductTocart, gotoCheckout, cartPage, page }) => {
      await cartPage.continueToBillingAddressGuest();
      await expect(cartPage.countryOption).toBeVisible();
      await cartPage.countrySelect("NL");
      await cartPage.postalCodeFill(billing_address.postal_code);
      await cartPage.houseNumberFill(billing_address.house_number);
      await page.keyboard.press("Tab");
      await expect(cartPage.postalcodeLookup).toBeVisible();
      await expect(cartPage.streetField).not.toHaveValue(
        billing_address.Street,
      );
      await expect(cartPage.cityField).not.toHaveValue(billing_address.city);
      await expect(cartPage.stateField).not.toHaveValue(billing_address.state);
      await cartPage.submitBtnCheckoutClick();
      await expect(cartPage.paymentMethodDropdown).toBeVisible();
    },
  );
});
