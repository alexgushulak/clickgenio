import fs from 'fs';
import path from 'path';
import prisma, { getLastNImages, uploadImageDataToDB } from '../db.js';
import { downloadFromS3 } from './s3Handler.js';


class ImagePreviewCacheJob {
  constructor(intervalMinutes) {
    this.intervalMinutes = intervalMinutes;
    this.userPromptsList = [];
    this.previewUrlsList = [];
    this.IDList = [];
  }

  async start() {
    // Schedule the job to run at regular intervals
    try {
      console.log('Deleting files from image-cache...');
      await this.deleteImageCacheFiles();
      console.log('Fetching and caching images...');
      await this.fetchAndCacheImages(20);
    } catch (err) {
      console.error('Error in image caching job:', err);
    }

    this.intervalId = setInterval(async () => {
      // Delete All Files from /image-cache
      try {
        console.log('Deleting files from image-cache...');
        await this.deleteImageCacheFiles();
        console.log('Fetching and caching images...');
        await this.fetchAndCacheImages(20);
      } catch (err) {
        console.error('Error in image caching job:', err);
      }
    }, this.intervalMinutes * 60 * 1000); // Convert minutes to milliseconds
  }

  async stop() {
    // Stop the job (clear the interval)
    clearInterval(this.intervalId);
  }

  async fetchAndCacheImages(images) {
    const data = await getLastNImages(images);

    for (const item of data) {
        this.userPromptsList.push(item.userPrompt);
        this.previewUrlsList.push(item.previewUrl);
        this.IDList.push(item.imageId);
    }

    for (const file_name of this.IDList) {
        let fileStream = await downloadFromS3(`preview/${file_name}.jpg`);
        const localFilePath = `image-cache/${file_name}.jpg`;
        const writeStream = fs.createWriteStream(localFilePath);
        fileStream.pipe(writeStream);
    }
  }

  async deleteImageCacheFiles() {
    const imageCachePath = 'image-cache'; // Replace with the actual path to your image-cache folder
    this.userPromptsList = [];
    this.previewUrlsList = [];
    try {
      const files = await fs.promises.readdir(imageCachePath);
      console.log("Files: ", files)
  
      for (const file of files) {
        if (file != '.gitignore') {
          const filePath = path.join(imageCachePath, file);
          await fs.promises.unlink(filePath); // Delete the file
        }
      }
  
      console.log('Deleted all files from image-cache folder.');
    } catch (err) {
      console.error('Error deleting files from image-cache:', err);
    }
  }  
}

export default ImagePreviewCacheJob;
