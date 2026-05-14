import { chromium, expect, FullConfig, request } from "@playwright/test";
import LoginPage from "@pages/login_page";
import CartServices from "@services/cart_services";
import { EnvironmentManager } from "@helper/utils";
import * as fs from "fs";


export async function globalSetup(config: FullConfig) {
  
  
  console.log(`\n--- 🛠️  Environment Setup: ${process.env.ENV} ---`);
  console.log(`Step 1: Creating new test user...`);
  
  
  const requstContext = await request.newContext();
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);
  const loginServices = new CartServices(requstContext);

  const token = await loginServices.getLoginToken();
  console.log(`Step 2: Retrieving and storing authentication token...`);
 
  process.env.PRACTICE_TOKEN = token;
  const userId = await loginServices.registerUser();
  const userIdDeisabled = await loginServices.registerDesableUser();
  console.log(`Succes Register id:${userId}`)
  process.env.USER_ID = userId;
  process.env.USER_ID_DISABLED = userIdDeisabled;

  

  console.log(`Step 3: Authenticating user session...`);
 
  await loginPage.gotoUrl('auth/login');
  await page.waitForTimeout(5000);
  
  // console.log('URL =>', page.url());
  // console.log('TITLE =>', await page.title());
  
  // await page.screenshot({
  //   path: 'debug.png',
  //   fullPage: true
  // });
  await loginPage.login('valid')
  await expect(page).toHaveURL(/\/account/)

  fs.mkdirSync('/auth/state', { recursive: true });
  await page.context().storageState({ path: './auth/state/storageState.json' });

  await browser.close();
  console.log(`[${new Date().toLocaleTimeString()}] ✅ AUTH: Login successful for valid user.`);
  console.log(`--------------------------------------\n`);

}

export default globalSetup;