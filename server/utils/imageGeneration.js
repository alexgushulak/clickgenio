import axios from 'axios';
import watermark from 'jimp-watermark';
import * as fs from 'node:fs';
import Jimp from 'jimp';
import S3Handler from './s3Handler.js';

export class WaterMarkService {
  constructor() {
    this.S3Instance = S3Handler.getInstance();
  }

  async writeBase64toPNG(image_object) {
    const imageId = Date.now().toString();
    const fileName = `full_${imageId}.png`;
    const localFilePath = `./generated-images/${fileName}`;
    const s3FolderName = 'full-images';
    var buf = new Buffer.from(image_object, 'base64');
    try {
      await fs.promises.writeFile(localFilePath, buf);
      console.log(`Image ${fileName} saved locally`);
      this.S3Instance.uploadToS3(fileName, localFilePath, s3FolderName);
      console.log(`Image ${fileName} uploaded to S3`);
      return { imageId, fileName, localFilePath };
    } catch (err) {
      console.error(`Full Image Error: ${err}`);
    }
  }

  async encodePNGtoBase64(date_string) {
    try {
      const imagePath = `./generated-images/watermarked_${date_string}.png`;
      // Delay added because the file is not immediately available
      await new Promise((resolve) => setTimeout(resolve, 500));
      const buf = await fs.promises.readFile(imagePath);
      const base64_image = buf.toString('base64');
      return base64_image;
    } catch (err) {
      console.error(`Base64 Image Error: ${err}`);
    }
  }

  async watermarkImage(date_string, full_image_path) {
    const watermarked_image_path = `./generated-images/watermarked_${date_string}.png`;
    try {
      await watermark.addWatermark(full_image_path, './assets/CLICKGENIO_watermark.png', {
        dstPath: watermarked_image_path,
        opacity: 0.3,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.uploadWatermarkImageToS3(`watermarked_${date_string}.png`, watermarked_image_path, 'watermarked-images');
    } catch (err) {
      console.error(`Watermark Image Error: ${err}`);
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const image = await Jimp.read(watermarked_image_path);
      image.resize(584, 400).write(watermarked_image_path);
    } catch (err) {
      console.error(`Image Resize Error: ${err}`);
    }
  }

  uploadWatermarkImageToS3(fileName, localFilePath, s3FolderName) {
    try {
      this.S3Instance.uploadToS3(fileName, localFilePath, s3FolderName);
    } catch (err) {
      console.error(`Upload Watermark Image Error: ${err}`);
    }
  }

  async createImageFiles(stabilityAIResponse) {
    try {
      const result = await this.writeBase64toPNG(stabilityAIResponse.artifacts[0].base64);
      const { imageId, localFilePath } = result || {};
      await this.watermarkImage(imageId, localFilePath);
      const base64_image = await this.encodePNGtoBase64(imageId);
      return { base64_image, imageId };
    } catch (err) {
      console.error("Create Image Files Error:", err);
    }
  }

  async generateImage(thumbnailText, apiHost, engineId, apiKey) {
    try {
      const response = await axios.post(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
        text_prompts: [
          {
            text: thumbnailText,
          },
        ],
        cfg_scale: 6,
        height: 832,
        width: 1216,
        steps: 60,
        samples: 1,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        }
      });
      console.log('Received Image from Stability.AI');
      const { base64_image, imageId } = await this.createImageFiles(response.data); // Assuming createImageFiles is defined elsewhere
      return { base64_image, imageId };
    } catch (err) {
      console.error("Generate Image Error:", err);
      throw err; // Optionally rethrow the error to handle it elsewhere if needed
    }
  }
}
