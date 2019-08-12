import * as dotenv from "dotenv";
dotenv.config();

export const DEBUG = process.env.DEBUG ? /true/i.test(process.env.DEBUG) : false;

export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 6007;

// S3 Bucket
export const bucket = process.env.S3_BUCKET;

// Database Parameters
export const dbSchema = process.env.DATABASE_SCHEMA;
export const dbUsername = process.env.DATABASE_USERNAME;
export const dbPassword = process.env.DATABASE_PASSWORD;
export const dbHost = process.env.DATABASE_ENDPOINT;

export const USERS_AUTHENTICATION_API_HOST = process.env.USERS_API_HOST || "http://localhost:6001";

export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  email: 'no-reply@spacenow.com',
  sender: 'Spacenow No-Reply',
  senderEmail: 'no-reply@spacenow.com',
  password: process.env.SMTP_LOGIN_PASSWORD,
  secure: false,
  tls: true,
};
