import { Page } from "@playwright/test";

export class NavBar {
  constructor(private readonly page: Page) {}

  get home() {
    return this.page.locator('[data-test="nav-home"]');
  }

  get categories() {
    return this.page.locator('[data-test="nav-categories"]')
  }

  get contact() {
    return this.page.locator('[data-test="nav-contact"]')
  }

  get sign_in() {
    return this.page.locator('[data-test="nav-sign-in"]')
  }

  get lenguage_switcher() {
    return this.page.locator('[data-test="language-select"]')
  }

  get cartIcon() {
    return this.page.locator('[data-test="nav-cart"]')
  }

  get accountName() {
    return this.page.locator('[data-test="nav-menu"]');
  }
}