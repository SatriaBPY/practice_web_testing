import { test, expect } from "src/fixture/fixture";
import { notification } from "@validation/notofication";
import { testData_regist } from "test-data/test_data";


test.describe("Login ", () => {
  test(
    "TCLF-001 - Verify login form components",
    { tag: ["@smoke", "@regression"] },
    async ({loginPage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.loginBtn).toBeVisible();
      await expect(loginPage.googleLogin).toBeVisible();
      
    },
  );

  test(
    "TCLF-002 - Successfully login with valid credentials as user role",
    { tag: ["@smoke", "@regression", "@flaky"] },
    async ({loginPage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.login('default');
      await expect(loginPage.userPage).toContainText(notification.Login.my_account)
      
    },
  );

  test(
    "TCLF-003 - Successfully login with valid credentials as admin role",
    { tag: ["@smoke", "@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.login('admin');
      await expect(loginPage.adminPage).toContainText(notification.Login.admin_dashborad)
      
    },
  );

  test(
    "TCLF-004 - Verify URL after successful login as users",
    { tag: ["@smoke", "@regression", "@flaky"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.login('default');
      await expect(page).toHaveURL(/\/account/)
      
    },
  );

  test(
    "TCLF-005 - Verify URL after successful login as admin",
    { tag: ["@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.login('admin');
      await expect(page).toHaveURL(/\/admin\/dashboard/);
      
    },
  );

  test(
    "TCLF-006 - Login with invalid credentials",
    { tag: ["@smoke", "@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.fillEmail("validmail@mail.com");
      await loginPage.fillPassword("validPass");
      await loginPage.tapLoginBtn();
      await loginPage.verifyErrorInvalidCredentials();
      await expect(loginPage.errorInvalidCredentials).toContainText(notification.Login.error_invalid_credentials)
      
    },
  );

  test(
    "TCLF-007 - Login using incorrect email format",
    { tag: ["@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.fillEmail("validmailFormat");
      await loginPage.fillPassword("validPass");
      await loginPage.tapLoginBtn();
      await loginPage.verifyErrorEmailFormat();
      await expect(loginPage.errorEmailFormat).toContainText(notification.Login.error_email_format);
      
    },
  );

  test(
    "TCLF-008 - Login using password less than 2 characters",
    { tag: ["@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.fillEmail("valid@mail.com");
      await loginPage.fillPassword("12");
      await loginPage.tapLoginBtn();
      await loginPage.verifyErrorPasswordLength();
      await expect(loginPage.errorPasswordLength).toContainText(notification.Login.error_password_lenght);
      
    },
  );

  test(
    "TCLF-009 - Login without filling email and password",
    { tag: ["@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();

      await loginPage.tapLoginBtn();
      await loginPage.verifyErrorPasswordLength();
      await expect(loginPage.errorEmailFormat).toContainText(notification.Login.error_email_empty);
      await expect(loginPage.errorPasswordLength).toContainText(notification.Login.error_password_empty);
      
    },
  );

  test(
    "TCLF-010 - Verify account locking after 3 failed attempts",
    { tag: ["@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.fillEmail('customer@practicesoftwaretesting.com');
      await loginPage.fillPassword('12345678')
      for(let i = 0; i < 3; i++) {
        await loginPage.tapLoginBtn();
      }
      await expect(loginPage.errorInvalidCredentials).toBeVisible();
      await expect(loginPage.errorInvalidCredentials).toContainText(notification.Login.error_account_locked);
      
    },
  );

  test(
    "TCLF-011 - Login with a disabled account",
    { tag: ["@regression"] },
    async ({loginPage, homePage, page }) => {
      await loginPage.openLoginPage();
      await expect(loginPage.emailField).toBeVisible();
      await loginPage.login('disable');
      await expect(loginPage.errorInvalidCredentials).toContainText(notification.Login.error_account_disabled)
      
    },
  );
  
});