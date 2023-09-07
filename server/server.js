import express from 'express';
import cors from 'cors';
import geoip from 'geoip-lite';
import bodyParser from 'body-parser';
import { generateImage, watermarkImage } from './utils/imageGeneration.js';
import * as fs from 'node:fs/promises';

const app = express()
app.use(cors())
const port = 3000
const jsonParser = bodyParser.json()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/info', (req, res) => {
    console.log(req.socket.remoteAddress);
    var ip = req.header('x-forwarded-for');
    var geo = geoip.lookup(ip);
    console.log(`IP-Address: ${req.header('x-forwarded-for')}`);
    console.log(geo);
    res.status(200).send({
        name: "",
        age: 30,
        address: "1234 Main St"
    })
})

app.post('/submit', jsonParser, async (req,res) => {
    const thumbnail_image_text = req.body.message
    const engineId = "stable-diffusion-xl-1024-v1-0";
    const apiHost = "https://api.stability.ai";
    const apiKey = "sk-36jFn0ywSl2ktMvPnqdMdcbJRdI1x3bNLL8Hydd81XrmxWT9";
    const base64_encoded_image = await generateImage(thumbnail_image_text, apiHost, engineId, apiKey)
    const watermarked_image = watermarkImage(base64_encoded_image, "clickgen.io")
    res.status(200).send({
        message: base64_encoded_image
    })
})

app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`)
})
