import dotenv from "dotenv";
import path from "path";
import { EnvironmentConfig } from "../types/env.intercaces";

const initializeEnv = (() => {
  dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

  if (process.env.ENV === "STAGING") {
    dotenv.config({
      path: path.resolve(process.cwd(), ".env"),
      override: true,
      quiet: true,
    });
  }

  console.log("=== Environment Variables Loaded ===");
  console.log("ENV:", process.env.ENV);
  console.log("====================================");

  return true;
})();

export class EnvironmentManager {
  private static credentials: EnvironmentConfig | null = null;

  static getCredentials(): EnvironmentConfig {
    if (this.credentials) {
      return this.credentials;
    }

    const env = process.env.ENV || "QA";

    const config: Record<string, EnvironmentConfig> = {
      QA: {
        api_base_url: "http://localhost:8091",
        base_url: "http://localhost:4200/",
        admin_email: process.env.QA_ADMIN_EMAIL_PRACTICE || "",
        admin_password: process.env.QA_ADMIN_PASSWORD_PRACTICE || "",
        validLogin: process.env.QA_VALID_LOGIN || "",
        validPassword: process.env.QA_VALID_PASSWORD || "",
        default_user: process.env.QA_DEFAULT_USER || "",
        default_password: process.env.QA_DEFAULT_PASSWORD || "",
        disableLogin: process.env.QA_DISABLE_LOGIN || "",
        disablePassword: process.env.QA_DISABLE_PASSWORD || "",
      },
      STAGING: {
        api_base_url: "https://api.practicesoftwaretesting.com",
        base_url: "https://practicesoftwaretesting.com/",
        admin_email: process.env.QA_ADMIN_EMAIL_PRACTICE || "",
        admin_password: process.env.QA_ADMIN_PASSWORD_PRACTICE || "",
        validLogin: process.env.QA_VALID_LOGIN || "",
        validPassword: process.env.QA_VALID_PASSWORD || "",
        default_user: process.env.QA_DEFAULT_USER || "",
        default_password: process.env.QA_DEFAULT_PASSWORD || "",
        disableLogin:
          process.env.QA_DISABLE_LOGIN || process.env.QA_DISABLE_EMAIL || "",
        disablePassword: process.env.QA_DISABLE_PASSWORD || "",
      },
    };

    this.credentials = config[env];

    return this.credentials;
  }

  static reloadCredentials(): EnvironmentConfig {
    this.credentials = null;
    return this.getCredentials();
  }
}
