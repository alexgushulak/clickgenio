// App.tsx
import React, { useState } from "react";
import {
  CssBaseline,
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { generateImage, submitIPData, downloadImage } from "./services/apiLayer";
import RainbowTesla from "./assets/rainbow_tesla.png";
import Tsunami from "./assets/tsunami.png";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import axios from 'axios';

let id: any = null

export default function App() {
  const engineId = import.meta.env.VITE_ENGINEID
  const apiHost = import.meta.env.VITE_APIHOST
  const apiKey = import.meta.env.VITE_APIKEY
  const [thumbnailText, setThumbnailText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageDownloadUrl, setImageDownloadUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [useFinalText, setUseFinalText] = useState(false);
  const [message, setMessage] = useState("");

  const handleTextbarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailText(event.target.value);
  };


  const handleKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setFinalText(thumbnailText);
      setUseFinalText(true);
      await onGenerateThumbnail();
      event.preventDefault();
    }
  };

  const onGenerateThumbnail = async () => {
    setIsClicked(true);
    setIsLoading(true);
    const textToUse = useFinalText && thumbnailText !== "" ? finalText : thumbnailText;
    await submitIPData(textToUse);
    const my_imageId = await generateImage(textToUse, apiHost, engineId, apiKey, setImageUrl);
    setImageId(my_imageId)
    setImageDownloadUrl(`${import.meta.env.VITE_APISERVER}/download/?id=${my_imageId}`)
    setIsLoading(false);
  };

  const ProductDisplay = () => (
    <section>
      <Box
          component="img"
          sx={{
            display: isClicked && !isLoading ? "inline-block" : "none",
            height: { xs: 200, sm: 300, md: 400 },
            width: { xs: 292, sm: 438, md: 584 },
            margin: '0 auto',
          }}
          src={imageUrl}
        />
      <form action={`http://localhost:5001/create-checkout-session/?imgid=${imageId}`} method="POST">
      <Button
          sx={{
            display: isClicked && !isLoading ? "block" : "none",
            "text-align": "center",
            margin: "0 auto",
            bottom: '75px',
            mt: 1,
            width: '250px'
          }}
          type="submit"
          color="success"
          variant="contained"
        >Download Full Size Image</Button>
      </form>
    </section>
  );

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    id = query.get("id");

    if (id) {
      try {
        setImageId(id);
        console.log(id);
      } catch {
        console.log("Error");
      }
    } else {
      console.log("No Id in Query");
    }

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
    
    submitIPData("Logged On")
  }, [])

  return (
    <div>
      <CssBaseline />
      <Routes>
        <Route path="/" element={""} />
      </Routes>
      <Container sx={{ mb: 5, mt: 15 }}>
        <ProductDisplay />
        <div>
          {id && (
            <div>
              <Button
                sx={{
                  height: '400px'
                }}
                variant="contained"
                href={`https://clickgenio-production.up.railway.app/download/?id=${imageId}`}
              >
                Thank you for your purchase!
                Click Here to Download Your Image Now!
              </Button>
            </div>
          )}
          {/* Other code here */}
        </div>
        <Typography
          variant="h3"
          component="h3"
          sx={{
            display: "block",
            "text-align": "center",
            margin: "0 auto",
            mt: 1,
          }}
        >
          clickgen.io
        </Typography>
        <TextField
          fullWidth={true}
          value={thumbnailText}
          onChange={handleTextbarChange}
          onKeyDown={handleKeyPress}
          label="Thumbnail Description"
          placeholder="A Rainbow Colored Tesla Model 3 Driving Through the Mountains"
          id="outlined-multiline-flexible"
          multiline
        />
        <Button
          sx={{
            display: isLoading ? "none" : "block",
            "text-align": "center",
            margin: "0 auto",
            mt: 1,
          }}
          variant="contained"
          onClick={onGenerateThumbnail}
        >
          GENERATE THUMBNAIL
        </Button>
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        )}
      </Container>
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: "center",
          alignItems: "center",
          margin: "25px auto",
          "text-align": "center"
        }}
      >
        <Box
          component="img"
          sx={{
            display: 'inline-block',
            margin: '0 auto',
            padding: '10px',
            height: { xs: 172, sm: 215, md: 215 },
            width: { xs: 301, sm: 377, md: 377 },
          }}
          src={RainbowTesla}
        />
        <Box
          component="img"
          sx={{
            display: 'inline-block',
            height: { xs: 172, sm: 215, md: 215 },
            width: { xs: 301, sm: 377, md: 377 },
            margin: '0 auto',
            padding: '10px'
          }}
          src={Tsunami}
        />
      </Container>

    </div>
  );
}
