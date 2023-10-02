import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import geoip from 'geoip-lite';
import bodyParser from 'body-parser';
import 'dotenv/config'
import { upload, downloadFromS3 } from './utils/s3Handler.js';
import stripe from 'stripe';
import prisma, { getLastNImages, uploadImageDataToDB } from './db.js';
import { ImageEngine } from './utils/ImageEngine.js';
import { promptEngineChatGPT } from './openai.js';
import ImagePreviewCacheJob from './utils/ImagePreviewCache.js'
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);


const app = express();
app.use(cors());
const port = 5001;
const jsonParser = bodyParser.json();
const imageCacheJob = new ImagePreviewCacheJob(0.1);
imageCacheJob.start()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var dir = path.join(__dirname, 'image-cache');
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/metadata', jsonParser, async (req, res) => {
    var ip = req.header('x-forwarded-for');
    if (!ip) {
        var ip = '72.229.28.185';
    }
    const geo = geoip.lookup(ip);
    var thumbnailText = req.body.message;
    console.log(`User Info -- IP-Address: ${ip}, Location: ${geo.city}, ${geo.country}, Thumbnail Text: ${thumbnailText}`);
    res.status(200).send({
        message: "Received Metadata"
    });
})

app.post('/generateImage', jsonParser, async (req, res) => {
    const thumbnail_image_text = req.body.message;
    const generation_steps = 10;
  
    try {
      const imageEngine = new ImageEngine('generated-images', 'full-images', generation_steps);
  
      // Fetch the image and save it on the server
      await imageEngine.fetchImage(thumbnail_image_text, promptEngineChatGPT);
      if (imageEngine.base64) {
        await imageEngine.saveImagesOnServer();
    
        // Save images on S3 and upload data to the database
        imageEngine.saveImagesOnS3();
        await uploadImageDataToDB(imageEngine.ID, imageEngine.userPrompt, imageEngine.stableDiffusionPrompt);
      }
      // Convert to base64 and send the response
      const imageBase64 = await imageEngine.convertToBase64();

      res.status(200).send({
        imageBase64: imageBase64,
        imageId: imageEngine.ID
      });
    } catch (err) {
      console.error("Submit Error:", err);
      res.status(500).send({
        message: "Internal Server Error"
      });
    }
  });
  
app.get('/gallery', jsonParser, async (req, res) => {
    function combineListsIntoObjects(list1, list2) {
        if (list1.length !== list2.length) {
          throw new Error("Lists must have the same length");
        }
      
        const combinedList = [];
      
        for (let i = 0; i < list1.length; i++) {
          const obj = {
            imageId: list1[i],
            userPrompt: list2[i]
          };
          combinedList.push(obj);
        }
      
        return combinedList;
      }
    
      const images = combineListsIntoObjects(imageCacheJob.IDList, imageCacheJob.userPromptsList);


    try {
        console.log("Getting Gallery Images")
        // const images = await getLastNImages(16);
        res.status(200).send({
            images
        })
    } catch (err) {
        console.log("Gallery Error:", err)
        res.status(500).send({
            message: "Internal Server Error, Gallery Could Not Be Fetched"
        })
    }
})

app.get('/download/:imagetype', jsonParser, async (req, res) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(req.query.id)) {
        res.status(400).send({ message: 'Invalid UUID format' });
        return;
    }

    if (!req.params.imagetype) {
        return;
    }

    try {
        let file_name = `${req.query.id}.jpg`;
        let s3path = `${req.params.imagetype}/${file_name}`;
        let fileStream = await downloadFromS3(s3path);
        res.attachment('thumbnail.jpg')
        fileStream.pipe(res);
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "Internal Server Error, Purchase could not be completed"
        })
    }
});

app.post('/upload', upload.single("file"), async (req, res) => {
    try {
        res.send("File Uploaded Succesfully");
    } catch (err) {
        console.log("File Upload Error", err)
        res.status(500).send({
            message: "Internal Server Error, Purchase could not be completed"
        })
    }
});

app.post('/create-checkout-session', async (req, res) => {
  const IMAGE_ID = req.query.imgid;
  console.log("BUY BUTTON CLICKED")
  const session = await stripeInstance.checkout.sessions.create({
    submit_type: 'pay',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: process.env.PRODUCT_CODE,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/home/?id=${IMAGE_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/`,
    automatic_tax: {enabled: true},
  });

  res.redirect(303, session.url);
});

app.get('*', function (req, res) {
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', (err) => {
        console.error(err)
        res.set('Content-Type', 'text/plain');
        res.status(400).end('Not found');
    });
});

app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`);
});
