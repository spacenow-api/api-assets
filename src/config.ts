import * as dotenv from "dotenv";
dotenv.config();

export const DEBUG = process.env.DEBUG ? Boolean(process.env.DEBUG) : false;

export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 6004;

// S3 Bucket
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
export const bucket = process.env.AWS_BUCKET;
