import { Page , expect, Locator} from "@playwright/test";
import { EnvironmentManager } from "@helper/utils";

const {
  base_url
} = EnvironmentManager.getCredentials();

export abstract class BasePage {
  protected readonly page: Page
  protected readonly firstProductCard: Locator
  
  constructor(page: Page) {
    this.page = page
    this.firstProductCard = this.page.locator('a[class="card"]').first()
  }

  
  
  async gotoUrl(url: string) {
    await this.page.goto(`https://practicesoftwaretesting.com/${url}`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
    console.log(await this.page.content());
  }

  async injectSessinStorage(cartId: string) {
    await this.page.evaluate((cartId) => {
      sessionStorage.setItem('cart_id', cartId)
      sessionStorage.setItem('cart_quantity', '1')
    }, cartId)
  }

  async verifyProductChangedAfterAction(firstProductName: string, secondProductName: string) {
    await expect(async () => {
      if (firstProductName === secondProductName) {
        throw new Error(`Fail filter: Product is shame (${firstProductName})`);
      }
      
      await expect(this.page.locator('a[class="card"]').first()).not.toContainText(firstProductName);
      
      console.log(`Success: "${firstProductName}" after filter "${secondProductName}"`);
    }).toPass({
      timeout: 10000,
      intervals: [1000],
    });
  }
  
}