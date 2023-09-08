import express from 'express';
import cors from 'cors';
import geoip from 'geoip-lite';
import bodyParser from 'body-parser';
import { generateImage, watermarkImage } from './utils/imageGeneration.js';
import * as fs from 'node:fs/promises';

const app = express();
app.use(cors());
const port = 5000;
const jsonParser = bodyParser.json();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/metadata', jsonParser, async (req, res) => {
    var ip = req.header('x-forwarded-for');
    var geo = geoip.lookup(ip);
    var thumbnailText = req.body.message;
    console.log(`IP-Address: ${req.header('x-forwarded-for')}`);
    console.log(`Location: ${geo}`);
    console.log(`Thumbnail Text: ${thumbnailText}`);
    res.status(200).send({
        message: "Successfully Received Metadata"
    });
})

app.post('/submit', jsonParser, async (req,res) => {
    const thumbnail_image_text = req.body.message;
    const engineId = "stable-diffusion-xl-1024-v1-0";
    const apiHost = "https://api.stability.ai";
    const apiKey = "sk-36jFn0ywSl2ktMvPnqdMdcbJRdI1x3bNLL8Hydd81XrmxWT9";
    try {
        const base64_encoded_image = await generateImage(thumbnail_image_text, apiHost, engineId, apiKey);
        console.log("Successfully Generated Image!")
        res.status(200).send({
            imageBase64: base64_encoded_image
        });
    } catch (err) {
        console.error("Submit Error:", err);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
});

app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`);
});
