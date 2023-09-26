import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { generateImage, submitDownloadData, submitIPData, submitThumbnailData, submitBuyData } from "../../services/apiLayer";
import ProductDisplay from "./ProductDisplay/ProductDisplay";
import TipsAndTricks from "./TipsAndTricks/TipsAndTricks";
import CustomizedSnackbars from './SnackBar';
import PromptInput from "./PromptInput/PromptInput";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    margin: '10px',
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function HomePage2() {
    const engineId = import.meta.env.VITE_ENGINEID
    const apiHost = import.meta.env.VITE_APIHOST
    const apiKey = import.meta.env.VITE_APIKEY
    const [thumbnailText, setThumbnailText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imageIsDisplayed, setImageIsDisplayed] = useState(false);
    const [imageId, setImageId] = useState("");
    const [finalText, setFinalText] = useState('');
    const [useFinalText, setUseFinalText] = useState(false);
    const [isEmptyTextBox, setIsEmptyTextBox] = useState(false);
  
    const handleTextbarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setThumbnailText(event.target.value);
    };

    const handleKeyPress = async (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        setFinalText(thumbnailText);
        setUseFinalText(true);
        await onGenerateThumbnail();
        event.preventDefault();
      }
    };
  
    const onGenerateThumbnail = async () => {
      if (thumbnailText.length > 0) {
        setImageIsDisplayed(true);
        setIsLoading(true);
        const textToUse = useFinalText && thumbnailText !== "" ? finalText : thumbnailText;
        await submitThumbnailData(textToUse);
        const my_imageId = await generateImage(textToUse, apiHost, engineId, apiKey, setImageUrl);
        setImageId(my_imageId)
        setIsLoading(false);
      } else {
        setIsEmptyTextBox(true);
      }
    };

    const onRefreshThumbnail = async () => {
      setImageIsDisplayed(true);
      setIsLoading(true);
      const textToUse = useFinalText && thumbnailText !== "" ? finalText : thumbnailText;
      await submitIPData(textToUse);
      const my_imageId = await generateImage(textToUse, apiHost, engineId, apiKey, setImageUrl);
      setImageId(my_imageId)
      setIsLoading(false);
    };

    const onDownloadWatermark = async () => {
      const textToUse = useFinalText && thumbnailText !== "" ? finalText : thumbnailText;
      await submitDownloadData(textToUse);
      const link = document.createElement("a");
      link.href = `${import.meta.env.VITE_APISERVER}/download2/watermark?id=${imageId}`;
      link.click();
    }

    const onBuyImage = async () => {
      const textToUse = useFinalText && thumbnailText !== "" ? finalText : thumbnailText;
      await submitBuyData(textToUse);
    }

    return (
      <Grid container spacing={0} sx={{padding: '10px'}}>
        {isEmptyTextBox && (
          <div style={{textTransform: 'uppercase'}}>
            <CustomizedSnackbars
              severity="warning"
              message="Thumbnail description can not be empty"
            />
          </div>
        )}
        <Grid item xs={12} md={5}>
          <Item>
            <PromptInput 
              thumbnailText={thumbnailText}
              handleTextbarChange={handleTextbarChange}
              handleKeyPress={handleKeyPress}
              onGenerateThumbnail={onGenerateThumbnail}
              isLoading={isLoading}
            />
          </Item>
          <Item>
            <TipsAndTricks />
          </Item>
        </Grid>
        <Grid item xs={12} md={7} 
          sx={{
            ml: 0,
            mr: 0
          }}>
          <Item sx={{display: imageIsDisplayed ? 'block': 'none',pl: 0, pr: 0}}>
            <ProductDisplay 
              isClicked={imageIsDisplayed}
              isLoading={isLoading}
              imageUrl={imageUrl}
              imageId={imageId}
              onRefreshThumbnail={onRefreshThumbnail}
              onDownloadWatermark={onDownloadWatermark}
              onPurchase={onBuyImage} />
          </Item>
        </Grid>
    </Grid>
    )
}