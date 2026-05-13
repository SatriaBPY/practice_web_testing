import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base_page";
import {
  SortOption,
  FilterCategory,
  NavBarOption,
} from "../types/options.types";
import  APIHelper  from "@helper/apihelper";
import { Product, ProductsApiResponse } from "../types/api.types";
import { apiParams } from "../types/options.types";
import { API_PATTERNS, API_HELPER } from "config/environment/api_endpoints";
import { NavBar } from "@component/navbar";

export default class HomePage extends BasePage {
  private apiHelper: APIHelper;
  private navBar: NavBar;
  constructor(page: Page) {
    super(page);
    this.apiHelper = new APIHelper(page);
    this.navBar = new NavBar(page);
  }

  //Product component
  //
  readonly productTitle = this.page
    .locator('[data-test="product-name"]')
    .first();
  readonly productPrice = this.page
    .locator('[data-test="product-price"]')
    .first();
  readonly co2rating = this.page
    .locator('[data-test="co2-rating-badge"]')
    .first();
  readonly compareIcon = this.page.locator('[data-test="compare-btn"]').first();
  readonly image = this.page.locator('[class="card-img-top"]').first();
  readonly outofstockLabel = this.page.locator('[data-test="out-of-stock"]');

  //grid display
  //
  readonly gridDisplay = this.page.locator(".col-md-9 .container");

  readonly firstProductCard = this.page.locator('a[class="card"]').first();
  readonly ecobadge = this.firstProductCard.locator('[data-test="eco-badge"]');
  readonly sortingDropdown = this.page.locator('[data-test="sort"]');
  readonly minSlider = this.page
    .getByRole("slider", {
      name: "ngx-slider",
      exact: true,
    })
    .first();
  readonly maxSlider = this.page.getByRole("slider", {
    name: "ngx-slider-max",
  });
  readonly searchField = this.page.locator('[data-test="search-query"]');
  readonly searchSubmitBtn = this.page.locator('[data-test="search-submit"]');
  readonly serchResetBtn = this.page.locator('[data-test="search-reset"]');
  readonly searchResults = this.page.locator('[data-test="search-caption"]');
  readonly searchResultsCount = this.page.getByTestId("search-result-count");
  readonly noResults = this.page.locator('[data-test="no-results"]');

  //FILTER BY CATEGORY HAND TOOLS
  readonly handTools = this.page.getByRole("checkbox", { name: "Hand Tools" });
  readonly handtools_hammer = this.page.getByRole("checkbox", {
    name: "Hammer",
  });
  readonly handtools_handsaw = this.page.getByRole("checkbox", {
    name: "Hand Saw",
  });
  readonly handtools_wrnch = this.page.getByRole("checkbox", {
    name: "Wrench",
  });
  readonly handtools_screwdriver = this.page.getByRole("checkbox", {
    name: "Screwdriver",
  });
  readonly handtools_pliers = this.page.getByRole("checkbox", {
    name: "Pliers",
  });
  readonly handtools_chisels = this.page.getByRole("checkbox", {
    name: "Chisels",
  });
  readonly handtools_measures = this.page.getByRole("checkbox", {
    name: "Measures",
  });
  //FILTER BY CATEGORY POWER TOOLS
  readonly powerTools = this.page.getByRole("checkbox", {
    name: "Power Tools",
  });
  readonly powertools_grinder = this.page.getByRole("checkbox", {
    name: "Grinder",
  });
  readonly powertools_sander = this.page.getByRole("checkbox", {
    name: "Sander",
  });
  readonly powertools_saw = this.page
    .getByRole("checkbox", { name: "Saw" })
    .nth(1);
  readonly powertools_drill = this.page.getByRole("checkbox", {
    name: "Drill",
  });
  //FILTER BY CATEGORY OTHER
  readonly others = this.page.getByRole("checkbox", { name: "Other" });
  readonly others_toolbelts = this.page.getByRole("checkbox", {
    name: "Tool Belts",
  });
  readonly others_storage = this.page.getByRole("checkbox", {
    name: "Storage Solutions",
  });
  readonly others_workbench = this.page.getByRole("checkbox", {
    name: "Workbench",
  });
  readonly others_safetygear = this.page.getByRole("checkbox", {
    name: "Safety Gear",
  });
  readonly others_fasteners = this.page.getByRole("checkbox", {
    name: "Fasteners",
  });
  //FILTER BY BRAND
  readonly forgeFlex = this.page.getByRole("checkbox", {
    name: "ForgeFlex Tools",
  });
  readonly mightyCraft = this.page.getByRole('checkbox', { name: 'MightyCraft Hardware' })
  //FILTER BY SUSTAINABILITY
  readonly onlyeco = this.page.getByRole("checkbox", {
    name: "Show only eco-friendly products",
  });
  //PAGINATION
  readonly prev = this.page
    .locator("li.page-item")
    .filter({ has: this.page.getByRole("button", { name: "Previous" }) });
  readonly next = this.page
    .locator("li.page-item")
    .filter({ has: this.page.getByRole("button", { name: "Next" }) });
  
  private paginationPage(pages: number): Locator{
    return this.page.getByRole("button", { name: `Page-${pages}` });
  }

  private activePages(pages: number): Locator {
    return this.page.locator('li.page-item').filter({ hasText: `${pages}` });
  }

  //co2rating
  private co2ratingValue(rating: "A" | "E"): Locator {
    if (rating === "A") {
      return this.co2rating.locator("span.co2-letter.rating-b");
    } else {
      return this.co2rating.locator("span.co2-letter.rating-e");
    }
  }

  /*
    METHOD
  */

  async tapFirstProduk() {
    await expect(this.firstProductCard).toBeVisible();
    await Promise.all([
      this.page.waitForNavigation(),
      this.firstProductCard.click(),
    ]);
  }

  async navbarSelect(option: NavBarOption) {
    return this.navbarMaping(option);
  }

  async tapNavbar(option: NavBarOption) {
    const value = await this.navbarMaping(option);
    await expect(value).toBeVisible();
    await value.click();
  }

  async navbarMaping(option: NavBarOption) {
    const maping: Record<NavBarOption, any> = {
      HOME: this.navBar.home,
      CATEGORIES: this.navBar.categories,
      CONTACT: this.navBar.contact,
      "SIGN-IN": this.navBar.sign_in,
      LANG: this.navBar.lenguage_switcher,
    };
    return maping[option];
  }
  /*
    FILTER BY CATEGORY
    EXPECT can be handle on the test file
  */

  async selectFIlter(option: FilterCategory) {
    const filter = await this.filterMaping(option);
  }

  async tapFilter(option: FilterCategory) {
    const filter = await this.filterMaping(option);
    await filter.click();
  }

  async captureApiRespone(
    Option?: "BYCATEGORY" | "BYBRANDS" | "BYECO",
  ): Promise<ProductsApiResponse> {
    const API_PATTERN =
      Option === "BYCATEGORY"
        ? API_PATTERNS.BYCATEGORY
        : Option === "BYBRANDS"
          ? API_PATTERNS.BYBRANDS
          : Option === "BYECO"
            ? API_PATTERNS.BYECO
            : API_PATTERNS.PRODUCTS_LIST;
  
    const apiPromise = this.apiHelper.waitForAPIResponse<ProductsApiResponse>(
      API_PATTERN,
      { statusCode: 200 },
    );
    await this.page.waitForLoadState("networkidle");
    return apiPromise;
  }

  async captureAPIRes(...params: apiParams[]): Promise<ProductsApiResponse> {
    const API_PATERN = API_HELPER.getProductPattern(params);
    const apiPromise = this.apiHelper.waitForAPIResponse<ProductsApiResponse>(
      API_PATERN,
      { statusCode: 200 },
    );

    await this.page.waitForLoadState("networkidle");
    return apiPromise;
  }

  async captureApiSerachRespone(
    Options: "SEARCH" | "RESET",
  ): Promise<ProductsApiResponse> {
    const API_PATTERN = API_PATTERNS.SEARCHPRODUCT;
    const API_PATERN2 = API_PATTERNS.RESETPRODUCT;
    const apiPattern = Options === "SEARCH" ? API_PATTERN : API_PATERN2;
    const apiPromise = this.apiHelper.waitForAPIResponse<ProductsApiResponse>(
      apiPattern,
      { statusCode: 200 },
    );

    await this.page.waitForLoadState("networkidle");
    return apiPromise;
  }

  async sortingOption(option: SortOption) {
    await expect(this.firstProductCard).toBeVisible();
    const value = await this.sortingMaping(option);
    await this.sortingDropdown.selectOption(value);
  }

  private async sortingMaping(option: SortOption) {
    const maping: Record<SortOption, string> = {
      "Name A-Z": "name,asc",
      "Name Z-A": "name,desc",
      "Price L-H": "price,asc",
      "Price H-L": "price,desc",
      "Co2 A-E": "co2_rating,asc",
      "Co2 E-A": "co2_rating,desc",
    };
    return maping[option];
  }

  private async filterMaping(option: FilterCategory) {
    const maping: Record<FilterCategory, Locator> = {
      "HAND TOOLS": this.handTools,
      HAMMEER: this.handtools_hammer,
      "HAND SAW": this.handtools_handsaw,
      WRENCH: this.handtools_wrnch,
      SCREWDRIVER: this.handtools_screwdriver,
      Pliers: this.handtools_pliers,
      Chisels: this.handtools_chisels,
      Measures: this.handtools_measures,
      "Power Tools": this.powerTools,
      Grinder: this.powertools_grinder,
      Sander: this.powertools_sander,
      Saw: this.powertools_saw,
      Drill: this.powertools_drill,
      Other: this.others,
      "Tool Belts": this.others_toolbelts,
      Storage: this.others_storage,
      Workbench: this.others_workbench,
      "Safty Gear": this.others_safetygear,
      Fasteners: this.others_fasteners,
      ForgeFlex: this.forgeFlex,
      MightiCraft: this.mightyCraft,
      "Show only eco": this.onlyeco,
    };

    return maping[option];
  }

  async filterByCategory(option: FilterCategory) {
    const filter = await this.filterMaping(option);
    await filter.click();
  }

  async pagination(pages: number | "Prev" | "Next") {
    if (pages === "Prev") {
      await this.prev.click();
    } else if (pages === "Next") {
      await this.next.click();
    } else {
      const pageBtn = this.paginationPage(pages);
      await pageBtn.click();
    }
  }

  async activePage(pages: number) {
    const actvPages = this.activePages(pages);
    await expect(actvPages).toHaveClass(/active/)
  }

  async serchProduct(query: string) {
    await this.searchField.fill(query);
    await this.searchSubmitBtn.click();
  }

  async searchResult() {
    await expect(this.searchResults).toBeVisible();
    await expect(this.searchResultsCount).toBeVisible();
    const count = await this.searchResultsCount.textContent();
    console.log(count);
  }

  async productState(): Promise<string | undefined> {
    const state = await this.productTitle.textContent();
    const stringProduct = String(state ?? "").trim();
    return stringProduct;
  }

  async resetSearch() {
    await this.serchResetBtn.waitFor({ state: "visible" });
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().includes("products") && response.status() === 200,
        { timeout: 15000 },
      ),
      this.serchResetBtn.click(),
    ]);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async adjustSlider(targetValue: number, type: "min" | "max") {
    const slider = type === "min" ? this.minSlider : this.maxSlider;

    const sliderBar = this.page.locator(".ngx-slider-full-bar");
    const barBox = await sliderBar.boundingBox();
    const minValue = parseInt(
      (await slider.getAttribute("aria-valuemin")) || "0",
    );
    const maxValue = parseInt(
      (await slider.getAttribute("aria-valuemax")) || "200",
    );

    if (barBox) {
      const targetX =
        barBox.x +
        barBox.width * ((targetValue - minValue) / (maxValue - minValue));

      const handleBox = await slider.boundingBox();
      if (handleBox) {
        await this.page.mouse.move(
          handleBox.x + handleBox.width / 2,
          handleBox.y + handleBox.height / 2,
        );
        await this.page.mouse.down();
        await this.page.mouse.move(targetX, handleBox.y + handleBox.height / 2);
        await this.page.mouse.up();
      }
    }
  }

  async priceVerification(price: any) {
    const productPrice = await this.productPrice.textContent();

    const cleanedPrice = productPrice?.replace(/[^0-9.]/g, "") ?? "0";
    const parsedPrice = parseFloat(cleanedPrice);

    const expectedPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^0-9.]/g, ""))
        : price;

    console.log(`Comparing UI: ${parsedPrice} with API: ${expectedPrice}`);

    await expect(parsedPrice).toBeLessThanOrEqual(expectedPrice);
  }

  async verifySortingAZ() {
    const actualNames = await this.productTitle.allInnerTexts();

    const expectedNames = [...actualNames].sort((a, b) => a.localeCompare(b));

    expect(actualNames).toEqual(expectedNames);
  }

  async verifyPriceByAPI(apiPrice: number, type: "low" | "higher") {
    const uiText = await this.productPrice.first().innerText();
    const uiPrice = parseFloat(uiText.replace(/[^0-9.]/g, ""));

    if (type === "low") {
      expect(uiPrice).toBeLessThan(apiPrice);
    } else {
      console.log(`API Reference: ${apiPrice} | UI Result: ${uiPrice}`);
      expect(uiPrice).toBeGreaterThan(apiPrice);
    }
  }

  async verifyCo2Rating(type: "A" | "E") {
    await expect(this.co2ratingValue(type)).toBeVisible();
    return this.co2ratingValue(type);
  }
}
