import { errorMonitor } from "events";

export const notification = {
  Product_Detail: {
    Succces_Add_To_cart: "Product added to shopping",
    succes_add_to_fav: "Product added to your",
    Fail_add_to_favorite: "Unauthorized, can not add",
    duplicate_add_to_faf : "Product already in your"
    
  },
  Cart: {
    error_email_format: "Email format is invalid",
    error_password_length: "Password length is invalid",
    error_invalid_credentials: "Invalid email or password",
    error_payment_bankname: "Bank name can only contain",
    error_payment_number: "Account number must be",
    product_qtt_updated: "Product quantity updated.",
    product_deleted: "Product deleted.",
    thank_you: "Thanks for your order! Your",
    theres_no_results: "There are no products found.",
    empty_cart: "The cart is empty. Nothing to display.",
    err_bank_name_special_char: "Bank name can only contain",
    err_account_name_special_char: "Account name can contain",
    err_account_number_special_char: "Account number must be",
    payment_success: "Payment was successful",
    succes_order: "Thanks for your order! Your"
  },
  Login: {
    admin_dashborad: "Sales over the years",
    my_account: "My account",
    error_invalid_credentials: "Invalid email or password",
    error_email_format: "Email format is invalid",
    error_password_lenght: "Password length is invalid",
    error_email_empty: "Email is required",
    error_password_empty: "Password is required",
    error_account_disabled: "Account disabled",
    error_account_locked: "Account locked, too many failed attempts. Please contact the administrator."
    
  }
}