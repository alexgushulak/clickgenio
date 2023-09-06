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
import { submitData, generateImage } from "./services/apiLayer";
import RainbowTesla from "./assets/rainbow_tesla.png";
import Tsunami from "./assets/tsunami.png";
import CircularProgress from "@mui/material/CircularProgress";

export default function App() {
  const engineId = "stable-diffusion-xl-1024-v1-0";
  const apiHost = "https://api.stability.ai";
  const apiKey = "sk-36jFn0ywSl2ktMvPnqdMdcbJRdI1x3bNLL8Hydd81XrmxWT9";
  const [thumbnailText, setThumbnailText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleTextbarChange = (event: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = event.target;
    setThumbnailText(value);
  };

  const trackClick = async () => {
    setIsLoading(true);
    await submitData(thumbnailText);
    await generateImage(thumbnailText, apiHost, engineId, apiKey, setImageUrl);
    setIsLoading(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <CssBaseline />
      <Routes>
        <Route path="/" element={""} />
      </Routes>
      <Container sx={{ mb: 5, mt: 15 }}>
        <img src={imageUrl} />
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
          AI Thumbnail Generator
        </Typography>
        <TextField
          fullWidth={true}
          value={thumbnailText}
          onChange={handleTextbarChange}
          id="outlined-multiline-flexible"
          placeholder="A Rainbow Colored Tesla Model 3 Driving Through the Mountains"
          multiline
          maxRows={1}
        />
        <Button
          sx={{
            display: isLoading ? "none" : "block",
            "text-align": "center",
            margin: "0 auto",
            mt: 1,
          }}
          variant="contained"
          onClick={trackClick}
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
        sx={{ display: "block", margin: "25px auto", "text-align": "center" }}
      >
        <Box
          component="img"
          sx={{
            height: 225,
            width: 400,
            display: "inline-block",
            margin: "0 auto",
            padding: "10px",
          }}
          alt="The house from the offer."
          src={RainbowTesla}
        />
        <Box
          component="img"
          sx={{
            height: 225,
            width: 400,
            display: "inline-block",
            margin: "0 auto",
            padding: "10px",
          }}
          alt="The house from the offer."
          src={Tsunami}
        />
      </Container>
    </div>
  );
}
