export const configEnv = {
  QA: {
    api_base_url: 'http://localhost:8091',
    base_url: 'http://localhost:4200',
    admin_email: process.env.QA_ADMIN_EMAIL_PRACTICE,
    admin_password: process.env.QA_ADMIN_PASSWORD_PRACTICE,
    validLogin: process.env.QA_VALID_LOGIN,
    validPassword:process.env.QA_VALID_PASSWORD,
    disableLogin:process.env.QA_DESABLE_LOGIN,
    disablePassword: process.env.QA_DESABLE_PAS
  },
  STAGING: {
    api_base_url: 'https://staging.practicesoftwaretesting.com',
    base_url: 'https://staging.practicesoftwaretesting.com',
    admin_email: 'staging_user@practicesoftwaretesting.com',
    admin_password: 'password_staging_123',
    validLogin: '',
    validPassword: '',
    disableLogin: '',
    disablePassword: '',
  }
};