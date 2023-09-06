const express = require('express')
const res = require('express/lib/response')
const cors = require('cors')
const geoip = require('geoip-lite')
const axios = require('axios')
const app = express()
var bodyParser = require('body-parser')
const port = 3000

// create application/json parser
var jsonParser = bodyParser.json()

app.use(cors())

const decodeImage = (image_object) => {
    const base64_decoded_image = atob(image_object.artifacts[0].base64)
      const byteNumbers = new Array(base64_decoded_image.length);
      for (let i = 0; i < base64_decoded_image.length; i++) {
          byteNumbers[i] = base64_decoded_image.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let decoded_jpeg_image = new Blob([byteArray], { type: 'image/jpeg' });
      return decoded_jpeg_image
};

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
    const response = await generateImage(thumbnail_image_text, apiHost, engineId, apiKey)
    res.status(200).send({
        message: response
    })
})

app.listen(port, ()=>{
    console.log(`Server Listening on port ${port}`)
})
