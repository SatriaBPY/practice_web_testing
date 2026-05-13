import { EnvironmentManager } from "@helper/utils";

const {
  api_base_url,
} = EnvironmentManager.getCredentials();

export const API_ENDPOINTS = {
  BASE_URL: `${api_base_url}`,
  PRODUCTS: {
    LIST: '/products',
    FILTER_BY_CATEGORY: (categoryId: string) => 
      `/products?page=0&by_category=${categoryId}`,
  },
  LOGIN: `${api_base_url}/users/login`,
  REGISTER: `${api_base_url}/users/register`,
  EDITUSER: `${api_base_url}/users/`,
  DELETEUSER: `${api_base_url}/users/`,
  CART: `${api_base_url}/carts`,
  FAVORITES: `${api_base_url}/favorites/`
} as const;

export const API_PATTERNS = {
  PRODUCTS_FILTER: /\/products\?.*by_category=/,
  PRODUCTS_LIST: /.*\/products\?.*/,
  SEARCHPRODUCT: /products\/search\?q=.*/,
  RESETPRODUCT: /products\?page=0&between=price,1,100&is_rental=false/,
  BYCATEGORY: /products\?.*by_category=[^&]+.*/,
  BYBRANDS: /products\?.*by_brand=[^&]+.*/,
  BYECO: /products\?.*eco_friendly=[^&]+.*/,
  COMBINEPRODUCTANDBRAND: /products\?.*(?=.*by_category=[^&]+)(?=.*by_brand=[^&]+).*/
  
} as const;


export const API_HELPER = {
 
  getProductPattern: (params: string[] = []) => {
    
    if (params.length === 0) return /\/products(\?.*)?$/;

    
    const lookaheads = params
      .map(p => `(?=.*${p}=[^&]+)`)
      .join('');

    
    return new RegExp(`\/products(\/search)?\\?${lookaheads}.*`);
  }
};