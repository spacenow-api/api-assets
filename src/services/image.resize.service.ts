import { Request } from "express";
import * as AWS from "aws-sdk";
import multer from "multer";
import s3Storage from "multer-sharp-s3";
import * as config from "../config";

const AWS_S3_BUCKET_NAME = config.bucket || "";
const s3 = new AWS.S3();

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
  Bucket: `${AWS_S3_BUCKET_NAME}/space-images`
};

const Key = (
  request: Request,
  file: any,
  callback: (error: any, metadata?: any) => void
): void => callback(null, `${request.params.folder}/spacenow-${Date.now()}`);

const upload = multer({
  fileFilter: imageFilter,
  storage: s3Storage({
    ...options,
    Key,
    multiple: true,
    resize: [
      { suffix: "lg", width: 1170 },
      { suffix: "md", width: 800 },
      { suffix: "sm", width: 400 },
      { suffix: "xs", width: 100 },
      { suffix: "original" }
    ],
    toFormat: "jpeg"
  })
});

export default upload;
