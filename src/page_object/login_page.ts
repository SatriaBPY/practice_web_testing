import { BasePage } from "./base_page";
import { Page, expect } from "@playwright/test";
import { NavBar } from "@component/navbar";
import { EnvironmentManager } from "@helper/utils";


export default class LoginPage extends BasePage {
  private readonly navBar: NavBar;
  constructor(page: Page) {
    super(page)
    this.navBar = new NavBar(page);
  }

  readonly emailField = this.page.locator('[data-test="email"]');
  readonly passwordField = this.page.locator('[data-test="password"]');
  readonly googleLogin = this.page.getByRole('button', { name: 'Sign in with Google' });
  readonly loginBtn = this.page.locator('[data-test="login-submit"]');

  readonly adminPage = this.page.locator('[data-test="page-title"]'); 
  readonly userPage = this.page.locator('div').filter({ hasText: 'My accountHere you can manage' }) 
  //error massage 
  readonly errorEmailFormat = this.page.locator('[data-test="email-error"]');
  readonly errorPasswordLength = this.page.locator('[data-test="password-error"]');
  readonly errorInvalidCredentials = this.page.locator('[data-test="login-error"]');

  async openLoginPage() {
    await this.gotoUrl('auth/login');
  }
  
  async login(option: "admin" | "valid" | "disable" | "default") {

      const credentials = EnvironmentManager.getCredentials();
      
      let email: string | undefined;
      let password: string | undefined;
  
      switch (option) {
        case "admin":
          email = credentials.admin_email;
          password = credentials.admin_password;
          break;
        case "valid":
          email = credentials.validLogin;
          password = credentials.validPassword;
          break;
        case "disable":
          email = credentials.disableLogin;
          password = credentials.disablePassword;
          break;
        case "default":
          email = credentials.default_user;
          password = credentials.default_password;
          break;
      }
  
      if (!email) {
        throw new Error(`Kredensial untuk role "${option}" tidak ditemukan di file .env!`);
      }
  
      await expect(this.emailField).toBeVisible();
      await this.emailField.fill(email);
      await this.passwordField.fill(password || '');
      await this.loginBtn.click();
    }

  async fillEmail(email: string) {
    await this.emailField.fill(email)
  }

  async fillPassword(pass: string) {
    await this.passwordField.fill(pass)
  }

  async tapLoginBtn() {
    await this.loginBtn.click();
  }


  async verifyErrorEmailFormat() {
    await expect(this.errorEmailFormat).toBeVisible();
  }

  async verifyErrorPasswordLength() {
    await expect(this.errorPasswordLength).toBeVisible();
  }

  async verifyErrorInvalidCredentials() {
    await expect(this.errorInvalidCredentials).toBeVisible();
  }

  async gotoHomepPage() {
    await this.navBar.home.waitFor({ state: 'visible' });
    await this.navBar.home.click();
  }
}