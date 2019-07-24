import { Request } from "express";
import * as AWS from "aws-sdk";
import * as config from "../config";

const AWS_S3_BUCKET_NAME = config.bucket || "";
const s3 = new AWS.S3();

AWS.config.update({
  secretAccessKey: config.awsSecretAccessKey,
  accessKeyId: config.awsAccessKeyId,
  region: "ap-southeast-2"
});

const Bucket = AWS_S3_BUCKET_NAME;

const Key = (
  request: Request,
  file: any,
  callback: (error: any, metadata?: any) => void
): void => callback(null, `${request.params.folder}/spacenow-${Date.now()}`);

const download = s3
  .getObject({
    Bucket,
    Key
  })
  .createReadStream();

export default download;
