import * as AWS from 'aws-sdk';
import * as config from '../config';

const AWS_S3_BUCKET_NAME = config.bucket || '';
const s3 = new AWS.S3();

AWS.config.update({
	secretAccessKey: config.awsSecretAccessKey,
	accessKeyId: config.awsAccessKeyId,
	region: 'ap-southeast-2',
});

const deletePhoto = (Key: string, callback: any) =>
	s3.deleteObject(
		{
			Bucket: AWS_S3_BUCKET_NAME,
			Key,
		},
		callback,
	);

export default deletePhoto;
