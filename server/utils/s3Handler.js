import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import * as fs from 'node:fs';

class S3Handler {
  constructor() {
    this.configureAWS();
    this.s3 = new AWS.S3();
    this.upload = multer({
      storage: multerS3({
        bucket: process.env.S3_BUCKET,
        s3: this.s3,
        key: (req, file, cb) => {
          const folderName = 'full-images/';
          const key = folderName + file.originalname;
          cb(null, key);
        },
      }),
    });
  }

  configureAWS(){
    AWS.config.update({
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      region: process.env.S3_REGION,
    });

  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new S3Handler();
    }
    return this.instance;
  }

  async uploadToS3(s3fileName, filePath, folderName) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${folderName}/${s3fileName}`,
      Body: fs.createReadStream(filePath),
    };

    try {
      const data = await this.s3.upload(params).promise();
      console.log('File uploaded successfully. S3 Location:', data.Location);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  }

  async downloadFromS3(file_name) {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const region = process.env.S3_REGION;
    const Bucket = process.env.S3_BUCKET;

    var fileKey = file_name;

    console.log('Trying to download the file', fileKey);

    this.configureAWS();

    var options = {
      Bucket: Bucket,
      Key: fileKey,
    };

    try {
      var data = await this.s3.getObject(options).promise();
      return data.Body;
    } catch (err) {
      console.error('Error downloading file:', err);
      throw err;
    }
  }
}

export default S3Handler;
