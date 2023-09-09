import Upload from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import 'dotenv/config';
import AWS from 'aws-sdk';

async function uploadToS3(file_name) {
    return 0
};

async function downloadFromS3(file_name) {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    const region = process.env.S3_REGION
    const Bucket = process.env.S3_BUCKET

    var fileKey = file_name

    console.log('Trying to download the file', fileKey);

    AWS.config.update(
      {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
      }
    );

    var s3 = new AWS.S3();
    var options = {
        Bucket: Bucket,
        Key: fileKey,
    };

    var fileStream = s3.getObject(options).createReadStream();
    
    return fileStream
};

export { uploadToS3, downloadFromS3 };