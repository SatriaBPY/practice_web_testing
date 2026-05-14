import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envFile = process.env.ENV === "STAGING" ? ".env.staging" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log("=== Environment Variables Loaded ===");
console.log("ENV:", process.env.ENV);
console.log("====================================");

export class EnvironmentManager {
  static getCredentials() {
    const env = process.env.ENV || "QA";

    const config = {
      QA: {
        api_base_url: "http://localhost:8091",
        base_url: "http://localhost:4200/",
        admin_email: process.env.QA_ADMIN_EMAIL_PRACTICE,
        admin_password: process.env.QA_ADMIN_PASSWORD_PRACTICE,
        validLogin: process.env.QA_VALID_LOGIN,
        validPassword: process.env.QA_VALID_PASSWORD,
        default_user: process.env.QA_DEFAULT_USER,
        default_password: process.env.QA_DEFAULT_PASSWORD,
        disableLogin: process.env.QA_DISABLE_LOGIN,
        disablePassword: process.env.QA_DISABLE_PASSWORD,
      },
      STAGING: {
        api_base_url: "https://api.practicesoftwaretesting.com",
        base_url: "https://practicesoftwaretesting.com/",
        admin_email: process.env.QA_ADMIN_EMAIL_PRACTICE,
        admin_password: process.env.QA_ADMIN_PASSWORD_PRACTICE,
        validLogin: process.env.QA_VALID_LOGIN,
        validPassword: process.env.QA_VALID_PASSWORD,
        default_user: process.env.QA_DEFAULT_USER,
        default_password: process.env.QA_DEFAULT_PASSWORD,
        disableLogin: process.env.QA_DISABLE_LOGIN,
        disablePassword: process.env.QA_DISABLE_PASSWORD,
      },
    };

    const credentials = config[env as keyof typeof config];

    return credentials;
  }
}
