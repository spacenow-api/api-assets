import { Request } from "express";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import * as config from "../config";

aws.config.update({
  secretAccessKey: config.awsSecretAccessKey,
  accessKeyId: config.awsAccessKeyId,
  region: "ap-southeast-2"
});

const s3 = new aws.S3();

const fileFilter = (
  request: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
): void => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(
      new Error("Invalid file type, only JPEG and PNG is allowed!"),
      false
    );
  }
};

const options = {
  acl: "public-read",
  s3,
  bucket: config.bucket
};

const metadata = (
  request: Request,
  file: Express.Multer.File,
  callback: (error: any, metadata?: any) => void
): void => callback(null, Object.assign({}, request.body));

const key = (
  request: Request,
  file: Express.Multer.File,
  callback: (error: any, metadata?: any) => void
): void => callback(null, request.params.id + ".jpg");

const upload = multer({
  fileFilter,
  storage: multerS3({
    ...options,
    metadata,
    key
  })
});

module.exports = upload;
