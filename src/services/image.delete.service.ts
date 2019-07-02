import { Request } from "express";
import * as AWS from "aws-sdk";
import multer from "multer";
import s3Storage from "multer-sharp-s3";
import * as config from "../config";

const AWS_S3_BUCKET_NAME = config.bucket || "";
const s3 = new AWS.S3();

AWS.config.update({
  secretAccessKey: config.awsSecretAccessKey,
  accessKeyId: config.awsAccessKeyId,
  region: "ap-southeast-2"
});

const options = {
  ACL: "public-read",
  s3,
  Bucket: AWS_S3_BUCKET_NAME
};

const Key = (
  request: Request,
  file: Express.Multer.File,
  callback: (error: any, metadata?: any) => void
): void => callback(null, `${request.query.id}`);

const upload = multer({
  storage: s3Storage({
    ...options,
    Key
  })
});

export default upload;
