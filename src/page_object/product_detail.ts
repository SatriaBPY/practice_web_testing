import { expect, Page } from "@playwright/test";
import { BasePage } from "./base_page";
import { notification } from "@validation/notofication";
import { NavBar } from "@component/navbar";

export default class ProductDetailPage extends BasePage {
  private navBar: NavBar;
  constructor(page: Page) {
    super(page);
    this.navBar = new NavBar(page);
  }

  /*
    PRODUCT KOMPONEN
  */

  readonly titleProduct = this.page.locator('[data-test="product-name"]');
  readonly priceProduct = this.page.locator('[data-test="unit-price"]');
  readonly co2rating = this.page.locator('[data-test="co2-rating-badge"]');
  readonly description = this.page.locator('[data-test="product-description"]');

  private imageProduct(name: string) {
    return this.page.getByRole("img", { name: `${name}`, exact: true });
  }

  
  //specification komponnen
  readonly specificationTitle = this.page.locator('[data-test="specs-title"]');
  readonly specificationTable = this.page.locator(
    '[data-test="product-specs"]',
  );
  //button and field
  readonly minusQttBtn = this.page.locator('[data-test="decrease-quantity"]');
  readonly maxQttBtn = this.page.locator('[data-test="increase-quantity"]');
  readonly qttField = this.page.locator('[data-test="quantity"]');
  readonly addtocartBtn = this.page.locator('[data-test="add-to-cart"]');
  readonly addtofavBtn = this.page.locator('[data-test="add-to-favorites"]');
  //releated product
  readonly relatedProduct = this.page.locator(
    "//div[@class='col']/div[@class='container']",
  );
  //notification
  get successAddtocart() {
    return this.page.getByRole("alert", {
      name: notification.Product_Detail.Succces_Add_To_cart,
    });
  }

  get successAddfav() {
    return this.page.getByRole("alert", {
      name: notification.Product_Detail.succes_add_to_fav,
    });
  }

  get failAddfav() {
    return this.page.getByRole("alert", {
      name: notification.Product_Detail.Fail_add_to_favorite,
    });
  }

  get duplicateAddfav() {
    return this.page.getByRole("alert", {
      name: notification.Product_Detail.duplicate_add_to_faf,
    });
  }

  /*

  METHODS

  */

  async addToCartAction() {
    await this.addtocartBtn.waitFor({ state: "visible" });
    await this.addtocartBtn.click();
  }

  async addToFavAction() {
    await this.addtofavBtn.waitFor({ state: "visible" });
    await this.addtofavBtn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(400);
    await this.addtofavBtn.click();
  }

  async inputQtt(qtt: string) {
    await this.qttField.waitFor({ state: "visible" });
    await this.qttField.clear();
    await this.qttField.fill(qtt);
  }

  async maxQttAction(times: number) {
    for (let i = 0; i < times; i++) {
      await this.maxQttBtn.click();
    }
  }

  async minQttAction(times: number) {
    for (let i = 0; i < times; i++) {
      await this.minusQttBtn.click();
    }
  }

  async cartVerification() {
    await expect(this.navBar.cartIcon).toBeVisible();
    const count_cart = await this.navBar.cartIcon.innerText();
    console.log(`Total Cart: ${count_cart}`)
  }

  async gotoCartPage() {
    await this.navBar.cartIcon.click();
  }

  async accountNameVerification() {
    await expect(this.navBar.accountName).toBeVisible();
  }
}
