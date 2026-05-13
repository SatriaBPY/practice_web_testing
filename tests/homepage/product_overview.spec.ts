import { test, expect } from "src/fixture/fixture";
import { notification } from "@validation/notofication";
import { EnvironmentManager } from "@helper/utils";
const {
  base_url
} = EnvironmentManager.getCredentials();

test.describe("Product Overview - ", () => {
  test(
    "TCPO-001 - Verify visual product components",
    { tag: ["@smoke", "@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.firstProductCard).toBeVisible();
      await expect(homePage.productTitle).toBeVisible();
      await expect(homePage.productPrice).toBeVisible();
      await expect(homePage.co2rating).toBeVisible();
      await expect(homePage.compareIcon).toBeVisible();
      await expect(homePage.image).toBeVisible();
    },
  );

  test(
    "TCPO-002 - Verify product card display",
    { tag: ["@smoke"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.firstProductCard).toBeVisible();
    },
  );

  test(
    "TCPO-003 - Verify product grid layout",
    { tag: ["@smoke"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.gridDisplay).toBeVisible();
      await expect(homePage.gridDisplay).toHaveCSS("display", "grid");
    },
  );

  test(
    "TCPO-004 - Navigate to product detail page",
    { tag: ["@smoke"] },
    async ({ home, homePage, page }) => {
      await homePage.tapFirstProduk();
      await expect(page).toHaveURL(/\/product\/[\w-]+/);
    },
  );

  test(
    "TCPO-005 - Verify Homepage URL navigation",
    { tag: ["@smoke"] },
    async ({ home, homePage, page }) => {
      await expect(page).toHaveURL(`${base_url}`);
    },
  );

  test(
    "TCPO-006 - Navigate to Contact page",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await homePage.tapNavbar("CONTACT");
      await expect(page).toHaveURL(/\/contact/);
    },
  );

  test(
    "TCPO-007 - Navigate to Home page from Home",
    { tag: ["@smoke"] },
    async ({ home, homePage, page }) => {
      await homePage.tapNavbar("HOME");
      await expect(homePage.firstProductCard).toBeVisible();
      await expect(page).toHaveURL(`${base_url}`);
    },
  );

  test(
    "TCPO-008 - Navigate to Sign-In page",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await homePage.tapNavbar("SIGN-IN");
      await expect(page).toHaveURL(/\/auth\/login/);
    },
  );

  test(
    "TCPO-009 - Navigate to a specific page number",
    { tag: ["@smoke", "@regression"] },
    async ({ home, homePage, page }) => {
      await homePage.pagination(3);
      await expect(homePage.firstProductCard).toBeVisible();
    },
  );

  test(
    "TCPO-010 - Navigate to first page via page number",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await homePage.pagination(3);
      await expect(homePage.firstProductCard).toBeVisible();
      await homePage.pagination(1);
      await expect(homePage.firstProductCard).toBeVisible();
    },
  );

  test(
    "TCPO-011 - Navigate to next page using control (>>)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await homePage.pagination("Next");
      await expect(homePage.firstProductCard).toBeVisible();
    },
  );

  test(
    "TCPO-012 - Navigate to previous page using control (<<)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.firstProductCard).toBeVisible();
      await homePage.pagination(3);
      await expect(homePage.firstProductCard).toBeVisible();
      await homePage.pagination("Prev");
      await expect(homePage.firstProductCard).toBeVisible();
    },
  );

  test(
    "TCPO-013 - Navigate to previous page while on page 1",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.firstProductCard).toBeVisible();
      await expect(homePage.prev).toHaveClass(/disabled/);
    },
  );

  test(
    "TCPO-014 - Navigate to next page while on last page",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.firstProductCard).toBeVisible();
      await homePage.pagination(5);
      await expect(homePage.firstProductCard).toBeVisible();
      await expect(homePage.next).toHaveClass(/disabled/);
    },
  );

  test(
    "TCPO-015 - Verify Search Field Default State",
    { tag: ["@smoke", "@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await expect(home.searchField).toHaveValue("");
    },
  );

  test(
    "TCPO-016 - Search available product with full name",
    { tag: ["@smoke", "@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("Safety Goggles");
      await homePage.searchResult();
      await expect(homePage.searchResults).toContainText("Safety Goggles");
    },
  );

  test(
    "TCPO-017 - Search for non-existent product",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("No Product");
      await homePage.searchResult();
      await expect(homePage.searchResults).toContainText("No Product");
    },
  );

  test(
    "TCPO-018 - Search with partial product name (3 characters)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("Saf");
      await homePage.searchResult();
      await expect(homePage.searchResults).toContainText("Saf");
    },
  );

  test(
    "TCPO-019 - Search using Special Characters",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("Safety #$%");
      await homePage.searchResult();
      await expect(homePage.searchResults).toContainText("Safety #$%");
    },
  );

  test(
    'TCPO-020 - Search "Out of Stock" product with full name',
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("Long Nose Pliers");
      await homePage.searchResult();
      await expect(homePage.searchResults).toContainText("Long Nose Pliers");
      await expect(homePage.outofstockLabel).toBeVisible();
    },
  );

  test(
    'TCPO-021 - Search "Out of Stock" product with partial name',
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("Long N");
      await homePage.searchResult();
      await expect(homePage.searchResults).toContainText("Long N");
      await expect(homePage.outofstockLabel).toBeVisible();
    },
  );

  test(
    "TCPO-022 - Search without entering a Keyword",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.firstProductCard).toBeVisible();
      const currentProduct = await homePage.productState();
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("");
      const result = await homePage.productState();
      await expect(result).toBe(currentProduct);
    },
  );

  test(
    "TCPO-023 - Reset search after successful search",
    { tag: ["@regression"] },
    async ({ home, homePage }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("Safety Goggles");
      const firstCapture = await homePage.captureApiSerachRespone("SEARCH");
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await expect(homePage.productTitle).toContainText("Safety Goggles");
      await expect(homePage.productTitle).toHaveText(firstProduct);
      const [secondCapture] = await Promise.all([
        homePage.captureApiSerachRespone("RESET"),
        homePage.resetSearch(),
      ]);
      const secondProduct = secondCapture.data[0]?.name;
      await expect(homePage.productTitle).toHaveText(secondProduct);
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-024 - Reset search without performing a search",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.firstProductCard).toBeVisible();
      const currentProduct = await homePage.productState();
      console.log(`First Product: ${currentProduct}`);
      await homePage.resetSearch();
      const result = await homePage.productState();
      console.log(`Result: ${result}`);
      await expect(result).toBe(currentProduct);
    },
  );

  test(
    'TCPO-025 - Reset search after "No Product Found" result',
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(home.searchField).toBeVisible();
      await homePage.serchProduct("No Product");
      await homePage.searchResult();
      const current = await expect(homePage.searchResults).toContainText(
        "No Product",
      );
      await homePage.resetSearch();
      const result = await homePage.productState();
      console.log(`Result: ${result}`);
      await expect(result).not.toBe(current);
    },
  );

  test(
    "TCPO-026 - Verify Category Filter Options",
    { tag: ["@smoke", "@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.handTools).toBeVisible();
      await expect(homePage.handtools_hammer).toBeVisible();
      await expect(homePage.handtools_chisels).toBeVisible();
      await expect(homePage.handtools_measures).toBeVisible();
      await expect(homePage.handtools_pliers).toBeVisible();
    },
  );

  test(
    "TCPO-027 - Filter by parent-category: Hand Tools",
    { tag: ["@smoke", "@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await expect(homePage.productTitle).toHaveText(firstProduct);
      await homePage.filterByCategory("HAND TOOLS");
      await expect(homePage.handTools).toBeChecked();
      await expect(homePage.handtools_hammer).toBeChecked();
      await expect(homePage.handtools_chisels).toBeChecked();
      await expect(homePage.handtools_measures).toBeChecked();
      await expect(homePage.handtools_pliers).toBeChecked();
      console.log(`Result: ${firstProduct}`);
    },
  );

  test(
    "TCPO-028 - Filter by parent-category: Power Tools",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await expect(homePage.productTitle).toHaveText(firstProduct);
      await homePage.filterByCategory("Power Tools");
      await expect(homePage.powerTools).toBeChecked();
      await expect(homePage.powertools_drill).toBeChecked();
      await expect(homePage.powertools_grinder).toBeChecked();
      await expect(homePage.powertools_sander).toBeChecked();
      await expect(homePage.powertools_saw).toBeChecked();
      await expect(homePage.firstProductCard).toBeVisible();
      const secondCapture = await homePage.captureApiRespone();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-029 - Filter by parent-category: Other",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await expect(homePage.productTitle).toHaveText(firstProduct);
      await homePage.filterByCategory("Other");
      await expect(homePage.others).toBeChecked();
      await expect(homePage.others_fasteners).toBeChecked();
      await expect(homePage.others_safetygear).toBeChecked();
      await expect(homePage.others_storage).toBeChecked();
      await expect(homePage.others_toolbelts).toBeChecked();
      await expect(homePage.others_workbench).toBeVisible();
      const secondCapture = await homePage.captureApiRespone();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-030 - Filter by sub-category: Hand Tools - Hammer",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await expect(homePage.productTitle).toHaveText(firstProduct);
      await homePage.filterByCategory("HAMMEER");
      await expect(homePage.handtools_hammer).toBeChecked();
      const secondCapture = await homePage.captureApiRespone();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-031 - Filter by multiple sub-categories (Hammer & Wrench)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await expect(homePage.productTitle).toHaveText(firstProduct);
      await homePage.filterByCategory("HAMMEER");
      await homePage.filterByCategory("WRENCH");
      await expect(homePage.handtools_hammer).toBeChecked();
      await expect(homePage.handtools_wrnch).toBeChecked();
      const secondCapture = await homePage.captureApiRespone();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-032 - Filter by three sub-categories",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await homePage.filterByCategory("HAMMEER");
      await homePage.filterByCategory("WRENCH");
      await homePage.filterByCategory("Measures");
      await expect(homePage.handtools_hammer).toBeChecked();
      await expect(homePage.handtools_wrnch).toBeChecked();
      await expect(homePage.handtools_measures).toBeChecked();
      const secondCapture = await homePage.captureApiRespone();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-033 - Uncheck a sub-category filter",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const [firstCapture] = await Promise.all([
        homePage.captureApiRespone("BYCATEGORY"),
        homePage.filterByCategory("SCREWDRIVER"),
      ]);

      await expect(homePage.productTitle).toContainText("Screwdriver");
      await expect(homePage.handtools_screwdriver).toBeChecked();

      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      const [secondCapture] = await Promise.all([
        homePage.captureApiSerachRespone("RESET"),
        homePage.filterByCategory("SCREWDRIVER"),
      ]);

      await expect(homePage.handtools_screwdriver).not.toBeChecked();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    'TCPO-034 - Reset all "Hand Tools" filters',
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await homePage.filterByCategory("HAND TOOLS");
      await expect(homePage.handtools_measures).toBeChecked();
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await homePage.filterByCategory("HAND TOOLS");
      await expect(homePage.handtools_measures).not.toBeChecked();
      await expect(homePage.handTools).not.toBeChecked();
      await expect(homePage.handtools_chisels).not.toBeChecked();
      await expect(homePage.handtools_hammer).not.toBeChecked();
      await expect(homePage.handtools_handsaw).not.toBeChecked();
      const result = await homePage.productState();
      console.log(`Result: ${result}`);
    },
  );

  test(
    "TCPO-035 - Filter by sub-category: Power Tools - Drill",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await homePage.filterByCategory("Drill");
      await expect(homePage.powertools_drill).toBeChecked();
      const secondCapture = await homePage.captureApiRespone();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-036 - Filter by sub-category: Grinder and Drill",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await homePage.filterByCategory("Drill");
      await homePage.filterByCategory("Grinder");
      await expect(homePage.powertools_drill).toBeChecked();
      await expect(homePage.powertools_grinder).toBeChecked();
      const secondCapture = await homePage.captureApiRespone();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-037 - Uncheck Power Tools sub-category",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const [firstCapture] = await Promise.all([
        homePage.captureApiRespone("BYCATEGORY"),
        homePage.filterByCategory("Drill"),
      ]);
      (await homePage.filterByCategory("Grinder"),
        await expect(homePage.powertools_drill).toBeChecked());
      await expect(homePage.powertools_grinder).toBeChecked();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);

      await homePage.filterByCategory("Grinder");
      const [secondCapture] = await Promise.all([
        homePage.captureApiSerachRespone("RESET"),
        homePage.filterByCategory("Drill"),
      ]);

      await expect(homePage.powertools_drill).not.toBeChecked();
      await expect(homePage.powertools_grinder).not.toBeChecked();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-038 - Reset all 'Power Tools' filters",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const [firstCapture] = await Promise.all([
        homePage.captureApiRespone("BYCATEGORY"),
        homePage.filterByCategory("Power Tools"),
      ]);
      await expect(homePage.powerTools).toBeChecked();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      const [secondCapture] = await Promise.all([
        homePage.captureApiSerachRespone("RESET"),
        homePage.filterByCategory("Power Tools"),
      ]);
      await expect(homePage.powertools_drill).not.toBeChecked();
      await expect(homePage.powertools_grinder).not.toBeChecked();
      await expect(homePage.powertools_saw).not.toBeChecked();
      await expect(homePage.powertools_sander).not.toBeChecked();

      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-039 - Filter by sub-category: Other - Storage",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      const [secondCapture] = await Promise.all([
        homePage.captureApiRespone(),
        homePage.filterByCategory("Storage"),
      ]);
      await expect(homePage.others_storage).toBeChecked();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-040 - Filter by Workbench and Safety Gear",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      const [secondCapture] = await Promise.all([
        homePage.captureApiRespone(),
        homePage.filterByCategory("Storage"),
      ]);
      await homePage.filterByCategory("Safty Gear");
      await expect(homePage.others_storage).toBeChecked();
      await expect(homePage.others_safetygear).toBeChecked();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-041 - Uncheck Other sub-category",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const [firstCapture] = await Promise.all([
        homePage.captureApiRespone("BYCATEGORY"),
        homePage.filterByCategory("Storage"),
      ]);
      (await homePage.filterByCategory("Workbench"),
        await expect(homePage.others_storage).toBeChecked());
      await expect(homePage.others_workbench).toBeChecked();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);

      await homePage.filterByCategory("Workbench");
      const [secondCapture] = await Promise.all([
        homePage.captureApiSerachRespone("RESET"),
        homePage.filterByCategory("Storage"),
      ]);

      await expect(homePage.powertools_drill).not.toBeChecked();
      await expect(homePage.powertools_grinder).not.toBeChecked();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-042 - Reset all 'Other' filters",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const [firstCapture] = await Promise.all([
        homePage.captureApiRespone("BYCATEGORY"),
        homePage.filterByCategory("Other"),
      ]);
      await expect(homePage.others).toBeChecked();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      const [secondCapture] = await Promise.all([
        homePage.captureApiSerachRespone("RESET"),
        homePage.filterByCategory("Other"),
      ]);
      await expect(homePage.others_fasteners).not.toBeChecked();
      await expect(homePage.others_safetygear).not.toBeChecked();
      await expect(homePage.others_storage).not.toBeChecked();
      await expect(homePage.others_toolbelts).not.toBeChecked();
      await expect(homePage.others_workbench).not.toBeChecked();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await expect(homePage.productTitle).toContainText(secondProduct);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-043 - Filter by brand: ForgeFlex Tools",
    { tag: ["@smoke", "@regression", "@flaky"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      
      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes('by_brand'),
        homePage.filterByCategory('ForgeFlex')
      ]);

      await expect(homePage.forgeFlex).toBeChecked();
      console.log(`Current Product: ${firstProduct}`);
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      // await homePage.verifyProductChangedAfterAction(
      //   firstProduct,
      //   secondProduct,
      // );
    },
  );

  test(
    "TCPO-044 - Filter by brand: MightyCraft Hardware",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      const [secondCapture] = await Promise.all([
        homePage.captureApiRespone("BYBRANDS"),
        homePage.filterByCategory("MightiCraft"),
      ]);

      await expect(homePage.mightyCraft).toBeChecked();
      console.log(`Current Product: ${firstProduct}`);
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-045 - Filter by multiple brands",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      const [secondCapture] = await Promise.all([
        homePage.captureApiRespone("BYBRANDS"),
        homePage.filterByCategory("MightiCraft"),
      ]);
      await homePage.filterByCategory("ForgeFlex");
      await expect(homePage.mightyCraft).toBeChecked();
      await expect(homePage.forgeFlex).toBeChecked();
      console.log(`Current Product: ${firstProduct}`);
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-046 - Uncheck brand filter",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const [firstCapture] = await Promise.all([
        homePage.captureApiRespone("BYBRANDS"),
        homePage.filterByCategory("ForgeFlex"),
      ]);

      await homePage.filterByCategory("MightiCraft");
      await expect(homePage.mightyCraft).toBeChecked();
      await expect(homePage.forgeFlex).toBeChecked();
      const firstProduct = firstCapture.data[0]?.name;
      const [secondCapture] = await Promise.all([
        homePage.captureApiRespone("BYBRANDS"),
        homePage.filterByCategory("ForgeFlex"),
      ]);

      await expect(homePage.forgeFlex).not.toBeChecked();
      console.log(`Current Product: ${firstProduct}`);
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-047 - Verify Brand Filter Options",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.mightyCraft).toBeVisible();
      await expect(homePage.forgeFlex).toBeVisible();
    },
  );

  test(
    "TCPO-048 - Filter only Eco-Friendly products",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      const [secondCapture] = await Promise.all([
        homePage.captureApiRespone("BYECO"),
       homePage.filterByCategory("Show only eco"),
      ]);
      await expect(homePage.onlyeco).toBeChecked();
      console.log(`Current Product: ${firstProduct}`);
      await expect(homePage.ecobadge).toBeVisible();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-049 - Verify Sustainability Filter UI",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.onlyeco).toBeVisible();
    },
  );

  test(
    "TCPO-050 - Combined filter: Brand and Category",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.name;
      console.log(`Current Product: ${firstProduct}`);
      await homePage.filterByCategory("HAMMEER");
      await expect(homePage.handtools_hammer).toBeChecked();
      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("by_category", "by_brand"),
        homePage.filterByCategory("ForgeFlex"),
      ]);
      await expect(homePage.forgeFlex).toBeChecked();
      const secondProduct = secondCapture.data[0]?.name;
      console.log(`Result: ${secondProduct}`);
      await homePage.verifyProductChangedAfterAction(
        firstProduct,
        secondProduct,
      );
    },
  );

  test(
    "TCPO-051 - Verify Price Range Slider components",
    { tag: ["@smoke","@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.minSlider).toBeVisible();
      await expect(homePage.maxSlider).toBeVisible();
    },
  );

  test(
    "TCPO-052 - Filter price range 0 - 50",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.minSlider).toBeVisible();
      await expect(homePage.maxSlider).toBeVisible();

      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.price;
      console.log(`Current Product: ${firstProduct}`);

      await homePage.adjustSlider(0, "min");

      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(57, "max"),
      ]);
      const secondProduct = secondCapture.data[0]?.price;

      console.log(`Result: ${secondProduct}`);

      await expect(homePage.productPrice).toBeVisible();
      await homePage.priceVerification(secondProduct);
    },
  );

  test(
    "TCPO-053 - Filter price range 1 - 50",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.minSlider).toBeVisible();
      await expect(homePage.maxSlider).toBeVisible();

      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.price;
      console.log(`Current Product: ${firstProduct}`);

      await homePage.adjustSlider(1, "min");

      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(57, "max"),
      ]);
      const secondProduct = secondCapture.data[0]?.price;

      console.log(`Result: ${secondProduct}`);

      await expect(homePage.productPrice).toBeVisible();
      await homePage.priceVerification(secondProduct);
    },
  );

  test(
    "TCPO-054 - Filter price range 25 - 50",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.minSlider).toBeVisible();
      await expect(homePage.maxSlider).toBeVisible();

      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.price;
      console.log(`Current Product: ${firstProduct}`);

      await homePage.adjustSlider(27, "min");

      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(57, "max"),
      ]);
      const secondProduct = secondCapture.data[0]?.price;

      console.log(`Result: ${secondProduct}`);

      await expect(homePage.productPrice).toBeVisible();
      await homePage.priceVerification(secondProduct);
    },
  );

  test(
    "TCPO-055 - Filter price range 50 - 100",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.minSlider).toBeVisible();
      await expect(homePage.maxSlider).toBeVisible();

      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.price;
      console.log(`Current Product: ${firstProduct}`);

      await homePage.adjustSlider(57, "min");

      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(107, "max"),
      ]);
      const secondProduct = secondCapture.data[0]?.price;

      console.log(`Result: ${secondProduct}`);

      await expect(homePage.productPrice).toBeVisible();
      await homePage.priceVerification(secondProduct);
    },
  );

  test(
    "TCPO-056 - Filter price range 50 - 100",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.price;
      console.log(`Current Product: ${firstProduct}`);

      await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(50, "min"),
      ]);

      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(100, "max"),
      ]);
      const secondProduct = secondCapture.data[0]?.price;
      console.log(`Result: ${secondProduct}`);
      await homePage.priceVerification(secondProduct);
    },
  );

  test(
    "TCPO-057 - Filter price range 100 - 200",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.price;
      console.log(`Current Product: ${firstProduct}`);

      await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(100, "min"),
      ]);

      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(200, "max"),
      ]);
      const secondProduct = secondCapture.data[0]?.price;
      console.log(`Result: ${secondProduct}`);
      await homePage.priceVerification(secondProduct);
    },
  );

  test(
    "TCPO-058 - Filter price range 0 - 200 (Full Range)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.minSlider).toBeVisible();
      await expect(homePage.maxSlider).toBeVisible();

      const firstCapture = await homePage.captureApiRespone();
      const firstProduct = firstCapture.data[0]?.price;
      console.log(`Current Product: ${firstProduct}`);

      await homePage.adjustSlider(0, "min");

      const [secondCapture] = await Promise.all([
        homePage.captureAPIRes("between"),
        homePage.adjustSlider(200, "max"),
      ]);
      const secondProduct = secondCapture.data[0]?.price;

      console.log(`Result: ${secondProduct}`);

      await expect(homePage.productPrice).toBeVisible();
      await homePage.priceVerification(secondProduct);
    },
  );

  test(
    "TCPO-059 - Filter price range 0 - 0",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.minSlider).toBeVisible();
      await expect(homePage.maxSlider).toBeVisible();
      await homePage.adjustSlider(0, "min");
      await homePage.adjustSlider(0, "max");
      await expect(homePage.noResults).toContainText(
        notification.Cart.theres_no_results,
      );
    },
  );

  test(
    "TCPO-060 - Verify Sorting Dropdown Options",
    { tag: ["@smoke", "@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.sortingDropdown).toBeVisible();
    },
  );

  test(
    "TCPO-061 - Sort by Name A-Z",
    { tag: ["@smoke"] },
    async ({ home, homePage, page }) => {
      await Promise.all([
        homePage.captureApiRespone(),
        homePage.sortingOption("Name A-Z"),
      ]);
      await expect(homePage.productTitle).toBeVisible();
      await homePage.verifySortingAZ();
    },
  );

  test(
    "TCPO-062 - Sort by Name Z-A",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await Promise.all([
        homePage.captureApiRespone(),
        homePage.sortingOption("Name Z-A"),
      ]);
      await expect(homePage.productTitle).toBeVisible();
      await homePage.verifySortingAZ();
    },
  );

  test(
    "TCPO-063 - Sort by Price (High - Low)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstPrices = firstCapture.data[0]?.price;

      await Promise.all([
        homePage.captureApiRespone(),
        homePage.sortingOption("Price H-L"),
      ]);
      await expect(homePage.productPrice).toBeVisible();
      await homePage.verifyPriceByAPI(firstPrices, "higher");
    },
  );

  test(
    "TCPO-064 - Sort by Price (Low - High)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      const firstCapture = await homePage.captureApiRespone();
      const firstPrices = firstCapture.data[0]?.price;

      await Promise.all([
        homePage.captureApiRespone(),
        homePage.sortingOption("Price L-H"),
      ]);
      await expect(homePage.productPrice).toBeVisible();
      await homePage.verifyPriceByAPI(firstPrices, "low");
    },
  );

  test(
    "TCPO-065 - Sort by CO2 rating (A - E)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await Promise.all([
        homePage.captureApiRespone(),
        homePage.sortingOption("Co2 A-E"),
      ]);
      const rating = await homePage.verifyCo2Rating("A");
      await expect(rating).toHaveClass(/active/);
    },
  );

  test(
    "TCPO-066 - Sort by CO2 rating (E - A)",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await Promise.all([
        homePage.captureApiRespone(),
        homePage.sortingOption("Co2 E-A"),
      ]);
      const rating = await homePage.verifyCo2Rating("E");
      await expect(rating).toHaveClass(/active/);
    },
  );

  test(
    "TCPO-067 - Refresh browser after sorting",
    { tag: ["@regression"] },
    async ({ home, homePage, page }) => {
      await expect(homePage.productTitle).toBeVisible();
      const [firstCapture] = await Promise.all([
        homePage.captureAPIRes(),
        homePage.sortingOption('Name Z-A'),
      ]);

      const firstTitle = await firstCapture.data[0]?.name;
      console.log("Title Before Refresh:" + firstTitle);

      await page.reload();

      const secondCapture = await homePage.captureApiRespone();
      const secondTitle = await secondCapture.data[0]?.name;
      console.log("Title After Refresh:" + secondTitle);
      await expect(secondTitle).not.toBe(firstTitle);
    },
  );

  test(
    "TCPO-068 - Sorting applied (e.g., CO2 rating (E–A)) on max page",
    { tag: [ "@bug"] },
    async ({ home, homePage, page }) => {

      await homePage.pagination(5)
      await expect(homePage.productTitle).toBeVisible();
      
      await Promise.all([
        homePage.captureApiRespone(),
        homePage.sortingOption("Co2 E-A"),
      ]);
      const rating = await homePage.verifyCo2Rating("E");
      await expect(rating).toHaveClass(/active/);

      await homePage.activePage(1);
      
    },
  );
});
