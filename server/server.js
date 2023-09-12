import express from 'express';
import cors from 'cors';
import geoip from 'geoip-lite';
import bodyParser from 'body-parser';
import 'dotenv/config'
import { generateImage, watermarkImage } from './utils/imageGeneration.js';
import { upload, downloadFromS3 } from './utils/s3Handler.js';
import stripe from 'stripe';
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
const port = 5001;
const jsonParser = bodyParser.json();

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

app.post('/submit', jsonParser, async (req,res) => {
    const thumbnail_image_text = req.body.message;
    const engineId = "stable-diffusion-xl-1024-v1-0";
    const apiHost = "https://api.stability.ai";
    const apiKey = "sk-36jFn0ywSl2ktMvPnqdMdcbJRdI1x3bNLL8Hydd81XrmxWT9";
    try {
        const { base64_image, imageId } = await generateImage(thumbnail_image_text, apiHost, engineId, apiKey);
        res.status(200).send({
            imageBase64: base64_image,
            imageId: imageId
        });
    } catch (err) {
        console.error("Submit Error:", err);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
});

app.get('/download', jsonParser, async (req, res) => {
    // needs auth
    try {
        let file_name = `full_${req.query.id}.png`;
        let s3path = `full-images/${file_name}`;
        let fileStream = await downloadFromS3(s3path);
        res.attachment('thumbnail.png')
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
  console.log(IMAGE_ID)
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
    success_url: `http://127.0.0.1:3000/?id=${IMAGE_ID}`,
    cancel_url: `https://clickgen.io/?=canceled=true `,
    automatic_tax: {enabled: true},
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));

app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`);
});
