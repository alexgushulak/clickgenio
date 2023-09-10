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
import { generateImage, submitIPData } from "./services/apiLayer";
import RainbowTesla from "./assets/rainbow_tesla.png";
import Tsunami from "./assets/tsunami.png";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import { NoEncryption } from "@mui/icons-material";

export default function App() {
  const engineId = import.meta.env.VITE_ENGINEID
  const apiHost = import.meta.env.VITE_APIHOST
  const apiKey = import.meta.env.VITE_APIKEY
  const [thumbnailText, setThumbnailText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [useFinalText, setUseFinalText] = useState(false);

  const handleTextbarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailText(event.target.value);
  };


  const handleKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      setFinalText(thumbnailText);
      setUseFinalText(true);
      await onGenerateThumbnail();
      event.preventDefault();
    }
  };

  const onGenerateThumbnail = async () => {
    setIsClicked(true);
    setIsLoading(true);
    const textToUse = useFinalText && thumbnailText !== ""? finalText : thumbnailText;
    await submitIPData(textToUse);
    await generateImage(textToUse, apiHost, engineId, apiKey, setImageUrl);
    setIsLoading(false);
  };

  React.useEffect(() => {
    submitIPData("Logged On")
  }, [])

  return (
    <div>
      <CssBaseline />
      <Routes>
        <Route path="/" element={""} />
      </Routes>
      <Container sx={{ mb: 5, mt: 15 }}>
        <Box
          component="img"
          sx={{
            display: isClicked && !isLoading ? "inline-block" : "none",
            height: 400,
            width: 584,
            margin: '0 auto',
          }}
          src={imageUrl}
        />
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
        sx={{ display: "block", margin: "25px auto", "text-align": "center" }}
      >
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
  );
}
