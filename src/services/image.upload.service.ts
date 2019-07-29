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
  sessionToken: config.awsSessionToken,
  region: "ap-southeast-2"
});

const imageFilter = (
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
  ACL: "public-read",
  s3,
  Bucket: `${AWS_S3_BUCKET_NAME}`
};

const Key = (
  request: Request,
  file: any,
  callback: (error: any, metadata?: any) => void
): void =>
  callback(
    null,
    `/space-images/${request.params.listingId}/spacenow-${Date.now()}.jpeg`
  );

const upload = multer({
  fileFilter: imageFilter,
  storage: s3Storage({
    ...options,
    Key,
    toFormat: "jpeg"
  })
});

export default upload;
