import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import { uploadToS3 } from './s3Handler.js';
import OpenAI from "openai";
import https from 'https';
import 'dotenv/config'

export class ImageEngine {
    static API_HOST = "https://api.stability.ai";
    static STABILITY_AI_API_KEY = process.env.STABILITY_AI_API_KEY
    static ENGINE_ID = 'stable-diffusion-xl-1024-v1-0';
    static YOUTUBE_THUMBNAIL = ' A Youtube thumbnail Of ';

    constructor(serverFolder, s3Folder, steps) {
        this.ID = uuidv4().toString()
        this.serverFolder = serverFolder
        this.s3Folder = s3Folder
        this.steps = steps
        this.engineId = ImageEngine.ENGINE_ID
        this.apiHost = ImageEngine.API_HOST
        this.apiKey = ImageEngine.STABILITY_AI_API_KEY
        this.height = 768
        this.width = 1344
        this.base64 = null
        this.base64_watermark = null
        this.userPrompt = null
        this.stableDiffusionPrompt = null
        this.imageUrl = null

        this.fullResolutionFileName = `${this.ID}.jpg`
        this.watermarkedFileName = `${this.ID}.jpg`
        this.previewFileName = `${this.ID}.jpg`

        this.fullResolutionFilePath = `${this.serverFolder}/full/${this.fullResolutionFileName}`
        this.watermarkedFilePath = `${this.serverFolder}/watermark/${this.watermarkedFileName}`
        this.previewFilePath = `${this.serverFolder}/preview/${this.previewFileName}`
    }

    fetchImageOpenAI = async (thumbnailDescription) => {
      try {
        this.userPrompt = thumbnailDescription
        this.stableDiffusionPrompt = this.userPrompt + " in the style of a youtube thumbnail"

        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const openaiOptions = {
          model: "dall-e-3",
          prompt: this.stableDiffusionPrompt,
          n: 1,
          size: "1792x1024",
        }

        const response = await openai.images.generate(openaiOptions);

        this.imageUrl = response.data[0].url
        return
      } catch (err) {
        console.log("fetchImageOpenAI Error: ", err)
      }
    }

    fetchImage = async (thumbnailDescription, promptEngine) => {
        try {
            this.userPrompt = thumbnailDescription
            this.stableDiffusionPrompt = await promptEngine(this.userPrompt, this.YOUTUBE_THUMBNAIL)
            console.log(this.stableDiffusionPrompt)

            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            }

            const config = {
                text_prompts: [{
                    text: this.stableDiffusionPrompt
                },],
                cfg_scale: 6,
                height: this.height,
                width: this.width,
                steps: this.steps,
                samples: 1,
            }

            const apiUrl = `${this.apiHost}/v1/generation/${this.engineId}/text-to-image`

            const stabilityAIResponse = await axios.post(
                apiUrl, 
                config,
                {headers: headers}
            );

            const { base64, seed, finishReason } = stabilityAIResponse.data.artifacts[0]
            this.base64 = base64
            console.log("fetchImage Completed")
        } catch (err) {
            if (err.response)  {
                console.error('Server responded with status code:', err.response.status);
                console.error('Error response data:', err.response.data);
                return err.response.data.message
            }
        }
    }

    _createFullResolutionJPG = async () => {
        try {
            if (!this.base64) {
              console.error('No base64 image data available.');
              return;
            }
      
            const imageBuffer = Buffer.from(this.base64, 'base64');

            const jpgBuffer = await sharp(imageBuffer)
              .toFormat('jpg')
              .toBuffer();

            fs.writeFileSync(this.fullResolutionFilePath, jpgBuffer);
      
            console.log('Image converted to JPG.');
          } catch (err) {
            console.error('createJPG Error:', err);
          }
    }

    _createWatermarkJPG = async(watermarkPath) => {
        try {
            if (!this.base64) {
              console.error('No input image data provided.');
              return;
            }

            const inputImageBuffer = Buffer.from(this.base64, 'base64');
            const watermarkBuffer = await fs.promises.readFile(watermarkPath);
      
            const outputImageBuffer = await sharp(inputImageBuffer)
              .composite([{ input: watermarkBuffer }])
              .toFormat('jpg')
              .toBuffer();
      
            fs.writeFileSync(this.watermarkedFilePath, outputImageBuffer);
      
            console.log('Watermark added to the image.');
            return outputImageBuffer;
          } catch (err) {
            console.error('watermarkPNG Error:', err);
          }
    }

    _createPreviewJPG = async (resizePercentage) => {
        try {
          if (!this.base64) {
            console.error('No input image data provided.');
            return;
          }
    
          const inputImageBuffer = Buffer.from(this.base64, 'base64');

          const newHeight = Math.round(resizePercentage * this.height);
          const newWidth = Math.round(resizePercentage * this.width);
    
          const outputImageBuffer = await sharp(inputImageBuffer)
            .resize({ width: newWidth, height: newHeight }) // Resize to 25% of the original dimensions
            .toFormat('jpg')
            .toBuffer();

          console.log(this.previewFilePath)

          fs.writeFileSync(this.previewFilePath, outputImageBuffer);
        } catch (err) {
          console.error('createPreview Error:', err);
        }
    }

    fetchImageAndReadToBuffer = async (imageLink) => {
      return new Promise((resolve, reject) => {
        // Need to wait until the HTTPS request is finished before trying to read the image to a buffer
        const filepath = `generated-images/full/${this.ID}.png`
        fs.openSync(filepath, 'w')
        const file = fs.createWriteStream(filepath);
  
        const request = https.get(imageLink, (res) => {
          res.pipe(file);
  
          res.on('end', () => {
            // The file has been written, now read it to a buffer
            const imageBuffer = fs.readFileSync(filepath);
            this.base64 = imageBuffer.toString('base64');
  
            // Resolve the promise indicating that the operation is complete
            resolve();
          });
  
          res.on('error', (error) => {
            // Reject the promise in case of an error
            reject(error);
          });
        });
  
        // Handle possible errors with the request
        request.on('error', (error) => {
          // Reject the promise in case of an error
          reject(error);
        });
      });
    }
    
    saveImagesOnServer = async (imageLink) => {
      await this.fetchImageAndReadToBuffer(imageLink)
      await this._createFullResolutionJPG()
      await this._createFullResolutionJPG()
      await this._createPreviewJPG(0.4)
    }

    saveImagesOnS3 = () => {
      uploadToS3(this.fullResolutionFileName, `./${this.serverFolder}/full/${this.fullResolutionFileName}`, 'full');
      uploadToS3(this.previewFileName, `./${this.serverFolder}/preview/${this.previewFileName}`, 'preview');
      // uploadToS3(this.watermarkedFileName, `./${this.serverFolder}/watermark/${this.watermarkedFileName}`, 'watermark');
    }

    getImageId = () => {
      return this.ID
    }
}

// const myImageEngine = new ImageEngine('generated-images', 'full-images', 0);

// myImageEngine.convertToBase64()
// myImageEngine._createFullResolutionJPG()
// // myImageEngine._createPreviewJPG(0.40)
