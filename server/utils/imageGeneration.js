import axios from 'axios';
import watermark from 'jimp-watermark';
// import watermark from 'watermarkjs';
import * as fs from 'node:fs';
import { Blob, Buffer } from 'buffer';
import { decode } from 'node:punycode';

const writeBase64toPNG = (image_object) => {
    var buf = new Buffer(image_object, 'base64');
    fs.writeFile('./image.png', buf, (err) => {
        if (err) throw err;
        console.log('File saved!');
    });

    return 0
};

const watermarkImage = (image_object, watermark_text) => {
    writeBase64toPNG(image_object.artifacts[0].base64)

    fs.promises.readFile('./image.png').then((data) => {
        // watermark(['./image.png'])
        //     .image(text.lowerLeft('clickgen.io', '48px Josefin Slab', '#fff', 0.5))
        //     .then(function (img) {
        //         document.getElementById('lower-left').appendChild(img);
        // });
        watermark.addTextWatermark('image.png', {
            'text': watermark_text,
            'textSize': 8,
            'dstPath' : './watermark.jpg'
        });
    })

    return 0
}

const generateImage = async (thumbnailText, apiHost, engineId, apiKey) => {
    try {
        const response = await axios.post(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
            text_prompts: [
                {
                    text: thumbnailText,
                },
            ],
            cfg_scale: 7,
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

        console.log("Generate Image Successful");
        return response.data;
    } catch (error) {
        console.error("Generate Image Error:", error);
    }
};

export { generateImage, watermarkImage };