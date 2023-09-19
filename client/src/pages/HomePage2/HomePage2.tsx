import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";
import { generateImage, submitIPData } from "../../services/apiLayer";
import ProductDisplay from "./ProductDisplay/ProductDisplay";
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import CustomizedSnackbars from './SnackBar';

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

    const onRefreshThumbnail = async () => {
      setIsClicked(true);
      setIsLoading(true);
      const textToUse = useFinalText && thumbnailText !== "" ? finalText : thumbnailText;
      await submitIPData(textToUse);
      const my_imageId = await generateImage(textToUse, apiHost, engineId, apiKey, setImageUrl);
      setImageId(my_imageId)
      setIsLoading(false);
    };

    const onDownloadWatermark = async () => {
      const link = document.createElement("a");
      link.href = `${import.meta.env.VITE_APISERVER}/download2/watermark?id=${imageId}`;
      link.click();
    }

    return (
        <Grid container spacing={3} sx={{padding: '25px'}}>
            <Grid item xs={12} md={5}>
                <Item>
                    <TextField
                        sx={{
                          borderColor: 'red'
                        }}
                        color='secondary'
                        fullWidth={true}
                        value={thumbnailText}
                        onChange={handleTextbarChange}
                        onKeyDown={handleKeyPress}
                        label="Describe Your Thumbnail"
                        placeholder="A Rainbow Colored Tesla Model 3 Driving Through the Mountains"
                        id="outlined-multiline-flexible"
                        multiline
                    />
                    <Button
                    className="btn-hover color-10"
                    sx={{
                        display: isLoading ? "none" : "block",
                        "text-align": "center",
                        margin: "0 auto",
                        width: '100%',
                        mt: 1,
                    }}
                    variant="contained"
                    onClick={onGenerateThumbnail}
                    >
                    GENERATE YOUR FREE THUMBNAIL
                    </Button>
                    {isLoading && (
                        <div style={{ marginTop: '10px', textTransform: "uppercase", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CustomizedSnackbars />
                            Please wait 30 seconds for the thumbnail to generate <CircularProgress sx={{padding: '10px'}}/>
                        </div>
                    )}
                </Item>
                <Item>
                <Alert severity="success" sx={{textAlign: 'left', fontSize: '14px', mb: '10px'}}>
                  <AlertTitle sx={{textTransform: "uppercase", textStyle: "bold", fontSize: '14px'}}>
                    <strong>Describe the image in as much detail as possible</strong>
                  </AlertTitle>
                  <i>Example:</i> Detailed, 4K-resolution image of a futuristic metropolis at dusk, featuring gleaming skyscrapers, intricate flying vehicle designs, and intricate city lighting
                </Alert>
                <Alert severity="success" sx={{textAlign: 'left', fontSize: '14px', mb: '10px'}}>
                  <AlertTitle sx={{textTransform: "uppercase", textStyle: "bold", fontSize: '14px'}}>
                    <strong>iterate multiple times</strong>
                  </AlertTitle>
                  <i>Initial prompt:</i> "Mountain landscape" <br/><br/>
                  <i>After reviewing the image:</i> "Breathtaking image of a snow-capped mountain peak at sunrise"
                </Alert>
                <Alert severity="error" sx={{textAlign: 'left', fontSize: '14px', mb: '10px'}}>
                  <AlertTitle sx={{textTransform: "uppercase", textStyle: "bold", fontSize: '14px'}}>
                    <strong>do not misspell words</strong>
                  </AlertTitle>
                  <i>Example:</i> detaled, 4K-resollution imag of a fueturistic metroplois at dusk
                </Alert>
                </Item>
            </Grid>
            <Grid item xs={12} md={7}>
                <Item>
                    <ProductDisplay 
                      isClicked={isClicked}
                      isLoading={isLoading}
                      imageUrl={imageUrl}
                      imageId={imageId}
                      onRefreshThumbnail={onRefreshThumbnail}
                      onDownloadWatermark={onDownloadWatermark} />
                </Item>
            </Grid>
        </Grid>
    )
}