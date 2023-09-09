import axios from 'axios';
import watermark from 'jimp-watermark';
import * as fs from 'node:fs';
import Jimp from 'jimp';
import { Buffer } from 'buffer';

async function writeBase64toPNG(image_object) {
    const date_string = Date.now().toString();
    const full_image_path = `./generated-images/full_${date_string}.png`;
    var buf = new Buffer.from(image_object, 'base64');
    try {
        await fs.promises.writeFile(full_image_path, buf)
        return [ date_string, full_image_path ];
    } catch(err) {
        console.log(`Full Image Error: ${err}`);
    }
};

async function encodePNGtoBase64(date_string) {
    try {
        const imagePath = `./generated-images/watermarked_${date_string}.png`;
        // Delay Added because the file is not immediately available
        await new Promise((resolve) => setTimeout(resolve, 500));
        const buf = await fs.promises.readFile(imagePath);
        const base64_image = buf.toString('base64');
        return base64_image;
    } catch(err) {
        console.log(`Base64 Image Error: ${err}`);
    }
}

async function watermarkImage(date_string, full_image_path) {
    const watermarked_image_path = `./generated-images/watermarked_${date_string}.png`;
    try {
        await watermark.addWatermark(full_image_path, './assets/CLICKGENIO_watermark.png', {
            'dstPath' : watermarked_image_path,
            'opacity': 0.3,
        });
    } catch(err) {
        console.log(`Watermark Image Error: ${err}`);
    }

    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const image = await Jimp.read(watermarked_image_path);
        image.resize(584,400).write(watermarked_image_path);
    } catch(err) {
        console.log(`Image Resize Error: ${err}`);
    }
};

/**
 * createImageFiles takes in a Base64 image object and creates a watermarked
 * png file and a full_size png file.
 */
const createImageFiles = async (stabilityAIResponse) => {

    let date_string, full_image_path;

    try {
        [date_string, full_image_path] = await writeBase64toPNG(stabilityAIResponse.artifacts[0].base64)
        await watermarkImage(date_string, full_image_path)
        return await encodePNGtoBase64(date_string);
    } catch (err) {
        console.error("Create Image Files Error:", err);
    }
}

const generateImage = async (thumbnailText, apiHost, engineId, apiKey) => {
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
            steps: 10,
            samples: 1,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            }
        });
        const base64image = await createImageFiles(response.data);
        return base64image;
    } catch (err) {
        console.error("Generate Image Error:", err);
    }
};

export { generateImage, watermarkImage };