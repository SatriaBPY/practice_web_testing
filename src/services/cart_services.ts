import { APIRequestContext } from "@playwright/test";
import { API_ENDPOINTS } from "config/environment/api_endpoints";
import { testData_regist, testDataValid_register } from "test-data/test_data";
import dotnv from "dotenv";
import { EnvironmentManager } from "@helper/utils";
import { forceDeleteUser } from "./db_services";

dotnv.config({ quiet: true });

const {
  admin_email,
  admin_password,
  validLogin,
  validPassword,
  disableLogin,
  disablePassword,
} = EnvironmentManager.getCredentials();

export default class CartServices {
  constructor(private request: APIRequestContext) {}

  async getLoginToken() {
    const responese = await this.request.post(`${API_ENDPOINTS.LOGIN}`, {
      // headers: {
      //   "Content-Type": "application/json",
      //   host: `${API_ENDPOINTS.BASE_URL}`,
      //   Accept: "application/json, text/plain, */*",
      // },
      data: {
        email: admin_email,
        password: admin_password,
      },
    });

    if (responese.status() !== 200) {
      throw new Error(`Failed to get token: ${responese.status()}`);
    }

    const body = await responese.json();

    const token = body.access_token;

    process.env.PRACTICE_TOKEN = token;

    return token;
  }

  async registerDesableUser() {
    const response = await this.request.post(`${API_ENDPOINTS.REGISTER}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRACTICE_TOKEN}`,
        "sec-ch-ua":
          '"Chromium";v="148", "Microsoft Edge";v="148", "Not/A)Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
      },
      data: { ...testData_regist },
    });

    const status = response.status();
  
    if (status === 409) {
      
      console.log(`[${new Date().toLocaleTimeString()}] ℹ️ INFO: User already exists (409). Proceeding with existing account.`);
      return response; 
    }
  
    if (status === 201 || status === 200) {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ SUCCESS: New user registered successfully.`);
      const body = await response.json();
      const iduser = body.id;
  
      return iduser;
    }
  
    
    const errorBody = await response.text();
    throw new Error(`Failed to register user: ${status} - ${errorBody}`);
  }

  async registerUser() {
    const response = await this.request.post(`${API_ENDPOINTS.REGISTER}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRACTICE_TOKEN}`,
        "sec-ch-ua":
          '"Chromium";v="148", "Microsoft Edge";v="148", "Not/A)Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
      },
      data: { ...testDataValid_register },
    });

    const status = response.status();
  
    if (status === 409) {
      
      console.log(`[${new Date().toLocaleTimeString()}] ℹ️ INFO: User already exists (409). Proceeding with existing account.`);
      return response; 
    }
  
    if (status === 201 || status === 200) {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ SUCCESS: New user registered successfully.`);
      const body = await response.json();
      const iduser = body.id;
  
      return iduser;
    }
  
    
    const errorBody = await response.text();
    throw new Error(`Failed to register user: ${status} - ${errorBody}`);

    
  }

  


  async getCartId() {
    const res = await this.request.post(`${API_ENDPOINTS.CART}`, {
      data: {},
    });

    if (res.status() !== 201) {
      throw new Error(
        `Failed to get cart id: ${res.status()} - ${await res.text()}`,
      );
    }

    const body = await res.json();
    return body.id;
  }

  async addProductToCartAsLogin(productId: string, cartId: string) {
    const res = await this.request.post(`${API_ENDPOINTS.CART}/${cartId}`, {
      headers: {
        host: `${API_ENDPOINTS.BASE_URL}`,
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${process.env.PRACTICE_TOKEN}`,
      },
      data: {
        product_id: productId,
        quantity: 1,
      },
    });

    if (res.status() !== 200) {
      throw new Error(`Failed to add product to cart: ${res.status()}`);
    }
  }

  async addProductToCartAsGuest(productId: string, cartId: string) {
    const res = await this.request.post(`${API_ENDPOINTS.CART}/${cartId}`, {
      data: {
        product_id: productId,
        quantity: 1,
      },
    });

    if (res.status() !== 200) {
      throw new Error(`Failed to add product to cart: ${res.status()}`);
    } else {
      console.log(await res.json());
    }
  }

  async deleteUser(userId: string) {
    const token = await this.getLoginToken();
  
    const res = await this.request.delete(
      `${API_ENDPOINTS.DELETEUSER}${userId}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  
    if (res.ok()) {
      console.log(`[API] User successfully deleted: ${userId}`);
      return;
    }
  
    const status = res.status();
    const errorBody = await res.text();
  
    console.error(`[API] Delete user failed`);
    console.error(`Status: ${status}`);
    console.error(`Response: ${errorBody}`);
  
    if ([409, 500].includes(status)) {
      console.warn(
        `[DB FALLBACK] Force deleting user from database: ${userId}`,
      );
  
      await forceDeleteUser(userId);
  
      return;
    }
  
    throw new Error(
      `Delete user failed with status ${status}: ${errorBody}`,
    );
  }

  async getTokenUser() {
    const responese = await this.request.post(`${API_ENDPOINTS.LOGIN}`, {
      data: {
        email: validLogin,
        password: validPassword,
      },
    });

    if (responese.status() !== 200) {
      throw new Error(`Failed to get token: ${responese.status()}`);
    }

    const body = await responese.json();

    const token = body.access_token;
    const userId = body.user_id;

    process.env.PRACTICE_TOKEN = token;

    return token;
  }

  async deleteAllFavorites() {
    const token = await this.getTokenUser();

    const response = await this.request.get(`${API_ENDPOINTS.FAVORITES}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to fetch favorites. Status: ${response.status()}`,
      );
    }

    const favorites = await response.json();

    if (favorites.length === 0) {
      console.log("Info: No favorite products found to delete.");
      return;
    }

    console.log(`Cleaning up ${favorites.length} favorite items...`);

    for (const item of favorites) {
      const idToDelete = item.id;

      const deleteRes = await this.request.delete(
        `${API_ENDPOINTS.FAVORITES}${idToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!deleteRes.ok()) {
        console.error(`Error: Failed to delete favorite ID: ${idToDelete}`);
      } else {
        console.log(`Success: Deleted favorite ID: ${idToDelete}`);
      }
    }
  }
}
