import { FullConfig, request } from "@playwright/test";
import CartServices from "@services/cart_services";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function globalTeardown(config: FullConfig) {
  console.log("========================================");
  console.log("INFO: Preparing global teardown process...");
  console.log("========================================");

  const requestContext = await request.newContext();
  const loginServices = new CartServices(requestContext);

  try {
    console.log("[1/3] Deleting all favorites...");
    await loginServices.deleteAllFavorites();
    
    
    await delay(2000); 

    console.log("[2/3] Deleting valid user...");
    await loginServices.deleteUser(process.env.USER_ID || "");
    
    
    await delay(2000); 

    console.log("[3/3] Deleting disabled user...");
    await loginServices.deleteUser(process.env.USER_ID_DISABLED || "");

    console.log("SUCCESS: Global teardown completed successfully.");
  } catch (error) {
    console.error("ERROR: Teardown failed:", error);
  } finally {
    console.log("========================================");
  }
}

export default globalTeardown;
