import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";
import { generateImage, submitIPData } from "../../services/apiLayer";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    maring: '100px',
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

let id: any = null

export default function HomePage2() {
    const engineId = import.meta.env.VITE_ENGINEID
    const apiHost = import.meta.env.VITE_APIHOST
    const apiKey = import.meta.env.VITE_APIKEY
    const [thumbnailText, setThumbnailText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [imageId, setImageId] = useState("");
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
        <form action={`${import.meta.env.VITE_APISERVER}/create-checkout-session/?imgid=${imageId}`} method="POST">
        <Button
            sx={{
              display: isClicked && !isLoading ? "inline-block" : "none",
              "text-align": "center",
              margin: "0 2px",
              bottom: '0px',
              mt: 1,
              width: '250px'
            }}
            type="submit"
            color="success"
            variant="contained"
          >Buy Full Size Image
        </Button>
        <Button
            sx={{
              display: isClicked && !isLoading ? "inline-block" : "none",
              "text-align": "center",
              margin: "0 2px",
              bottom: '0px',
              mt: 1,
              width: '250px'
            }}
            type="submit"
            color="info"
            variant="contained"
          >Download Low Res Image
        </Button>
        </form>
      </section>
    );
  
    const onDownload = () => {
      const link = document.createElement("a");
      link.href = `https://clickgenio-production.up.railway.app/download/?id=${imageId}`;
      link.click();
    };

    return (
        <Grid container spacing={2} sx={{mt: '20px'}}>
            <Grid item xs={12} md={5}>
                <Item>
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
                            Please Wait 30 Seconds for the Image to generate <CircularProgress />
                        </div>
                    )}
                </Item>
            </Grid>
            <Grid item xs={12} md={7}>
                <Item>
                    <h1>Thumbnail Preview</h1>
                    <Button variant="contained">Generate Random Image</Button>
                    <ProductDisplay />
                </Item>
            </Grid>
        </Grid>
    )
}