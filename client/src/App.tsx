import Container from '@mui/material/Container';
import { Button, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import RainbowTesla from './assets/rainbow_tesla.png'
import Tsunami from './assets/tsunami.png'
import Box from '@mui/material/Box';
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const engineId = 'stable-diffusion-xl-1024-v1-0'
  const apiHost = 'https://api.stability.ai'
  const apiKey = "sk-36jFn0ywSl2ktMvPnqdMdcbJRdI1x3bNLL8Hydd81XrmxWT9" // THIS NEEDS TO BE MOVED TO THE SERVER

  const [thumbnailText, setThumbnailText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  /** Input is one base64 encoded image
   *  Returns the image decoded in jpeg format"
   * */
  const decodeImage = (image_object: any) => {
    const base64_decoded_image = atob(image_object.artifacts[0].base64)
    const byteNumbers = new Array(base64_decoded_image.length);
    for (let i = 0; i < base64_decoded_image.length; i++) {
        byteNumbers[i] = base64_decoded_image.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    let decoded_jpeg_image = new Blob([byteArray], { type: 'image/jpeg' });
    return decoded_jpeg_image
  }

  /** tracks clicks on the generate thumbnail button" */
  const trackClick = () => {
    axios.post('https://alex-portfolio-production.up.railway.app/submit',
              {message: thumbnailText}
    ).then((res) => {
      // do nothing
    });

    const image = axios.post(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
        text_prompts: [
            {
                text: `${thumbnailText}`,
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
    }).then((response) => {
        let image = decodeImage(response.data)
        setImageUrl(URL.createObjectURL(image))
    }).catch((error) => {
        console.log(error)
    })

    console.log("Ending Post")

    navigate("/submit")
  }

  const handleTextbarChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target
    setThumbnailText(value)
  }

  React.useEffect(() => {
  }, []);

  return (
    <div>
        <CssBaseline />
        <Routes>
          <Route path="/submit" element={<p>Loading</p>} />
          <Route path="/" element={''} />
        </Routes>
          <Container sx={{ mb: 5, mt: 15 }}>
          <img src={imageUrl} />
          <Typography 
            variant="h3"
            component="h3"
            sx={{ display: 'block', 'text-align': 'center', margin: '0 auto', mt: 1}}>
            AI Thumbnail Generator
          </Typography>
          <TextField
            fullWidth={true}
            value={thumbnailText}
            onChange={handleTextbarChange}
            id="outlined-multiline-flexible"
            placeholder='A Rainbow Colored Tesla Model 3 Driving Through the Mountains'
            multiline
            maxRows={1}
          />
          <Button
            sx={{ display: 'block', 'text-align': 'center', margin: '0 auto', mt: 1}}
            variant="contained"
            onClick={trackClick}>
            GENERATE THUMBNAIL
          </Button>
          </Container>
          <Container sx={{ display: 'block', margin: '25px auto', 'text-align': 'center'}}>
            <Box
              component="img"
              sx={{
                height: 225,
                width: 400,
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px'
              }}
              alt="The house from the offer."
              src={RainbowTesla}
            />
            <Box
              component="img"
              sx={{
                height: 225,
                width: 400,
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px'
              }}
              alt="The house from the offer."
              src={Tsunami}
            />
        </Container>
    </div>
  )
}
