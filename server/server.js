import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import geoip from 'geoip-lite';
import bodyParser from 'body-parser';
import { OAuth2Client } from 'google-auth-library'
import { checkoutAction } from './payments/removeWatermark.js';
import { upload, downloadFromS3 } from './utils/s3Handler.js';
import { getImageCount, uploadImageDataToDB, markImageAsDownloaded, markImageAsPurchased, createUserAccount, updateIsEmailOk } from './db.js';
import { ImageEngine } from './utils/ImageEngine.js';
import { promptEngineChatGPT } from './openai.js';
import ImagePreviewCacheJob from './utils/ImagePreviewCache.js'
import 'dotenv/config'



const app = express();
app.use(cors());
const port = 5001;
const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const jsonParser = bodyParser.json();
const CACHE_REFRESH_TIME_IN_MINS = 480;
const NUMBER_OF_IMAGES_TO_CACHE = 50;
const imageCacheJob = new ImagePreviewCacheJob(CACHE_REFRESH_TIME_IN_MINS, NUMBER_OF_IMAGES_TO_CACHE);
imageCacheJob.start()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var dir = path.join(__dirname, '');
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


console.log(clientId, clientSecret)
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage',
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/user/emailOK', jsonParser, async (req, res) => {
  try {
    console.log(req.body.token)
    const id_token = req.body.token
    const segments = id_token.split('.');

    if (segments.length !== 3) {
      throw new Error('Not enough or too many segments');
    }

    var payloadSeg = segments[1];

    function base64urlDecode(str) {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return Buffer.from(base64, 'base64').toString();
    }

    var payload = JSON.parse(base64urlDecode(payloadSeg));

    await updateIsEmailOk(payload.email)

    res.json({
      message: "success"
    })
  } catch(err) {
    console.log("Error on route `/user/emailOk`: ", err)
    res.json({
      message: "failure"
    })
  }
})

app.post('/auth/google', jsonParser, async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    const id_token = tokens.id_token
    const segments = id_token.split('.');

    if (segments.length !== 3) {
      throw new Error('Not enough or too many segments');
    }

    var headerSeg = segments[0];
    var payloadSeg = segments[1];
    var signatureSeg = segments[2];

    function base64urlDecode(str) {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return Buffer.from(base64, 'base64').toString();
    }

    var header = JSON.parse(base64urlDecode(headerSeg));
    var payload = JSON.parse(base64urlDecode(payloadSeg));
    
    await createUserAccount(payload.email, payload.given_name)

    res.json({
      id_token,
      payload
    })
  } catch (err) {
    console.log("Login Failure: ", err)
    res.send(403)
  }
});

app.post('/metadata', jsonParser, async (req, res) => {
    var ip = req.header('x-forwarded-for');
    if (!ip) {
        var ip = '72.229.28.185';
    }
    const geo = geoip.lookup(ip);
    var thumbnailText = req.body.message;
    try {
      console.log(`User Info -- IP-Address: ${ip}, Location: ${geo.city}, ${geo.country}, Thumbnail Text: ${thumbnailText}`);
      res.status(200).send({
        message: "Received Metadata"
      });
    } catch (err) {
      console.log("Could not log user metadat", err)
    }
})

app.post('/generateImage', jsonParser, async (req, res) => {
    const thumbnail_image_text = req.body.message;
    const generation_steps = 40;
  
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
        res.setHeader('Content-Type', 'image/jpeg'); // Set the correct content type for your file
        res.setHeader('Content-Disposition', `inline; filename="${file_name}"`)
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

app.post('/updateImageData', async (req, res) => {

  const updateType = req.query.updateType;
  const imageID = req.query.id;

  if (updateType == "download") {
    try {
      const imageID = req.query.id;
      await markImageAsDownloaded(imageID)
      res.status(200).send()
    } catch (err) {
      console.error('Update Image Error: ', err)
    }
  } else if (updateType == "purchase") {
    try {
      const imageID = req.query.id;
      await markImageAsPurchased(imageID)
      res.status(200).send()
    } catch (err) {
      console.error('Update Image Error: ', err)
    }
  } else {

  }
})

app.post('/create-checkout-session', async (req, res) => {
  const imageId = req.query.imgid;
  const sessionId = "FAKE_ID_1000";
  console.log("BUY BUTTON CLICKED")
  const session = await checkoutAction(imageId, sessionId)
  res.redirect(303, session.url);
});

app.get('/imageCount', async (req, res) => {
  try {
    const count = await getImageCount();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting image count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
