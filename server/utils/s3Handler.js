import 'dotenv/config';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

AWS.config.update({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: process.env.S3_REGION
})

const s3 = new AWS.S3();

const upload = multer({
  storage:multerS3({
    bucket : process.env.S3_BUCKET,
    s3  : s3,
    key:(req, file, cb) => {
      const folderName = 'full-images/';
      const key = folderName + file.originalname
      cb(null, key);
    }
  })
});

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

export { upload, downloadFromS3 };