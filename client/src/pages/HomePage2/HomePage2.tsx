import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { generateImage, submitDownloadData, submitIPData, submitThumbnailData, submitBuyData, updateImageData } from "../../services/apiLayer";
import ProductDisplay from "./ProductDisplay/ProductDisplay";
import TipsAndTricks from "./TipsAndTricks/TipsAndTricks";
import PromptInput from "./PromptInput/PromptInput";
import GalleryComponent from "../GalleryComponent/GalleryComponent";
import { useSearchParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import words from 'profane-words'

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
    const [isEmptyTextBox, setIsEmptyTextBox] = useState(false);
    const [isIdLink, setIsIdLink] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [myImageURL, setMyImageURL] = useState('');
    
    useEffect(() => {
        if (searchParams.get('image')) {
            setImageUrl(`http://localhost:5001/download/watermark?id=${searchParams.get('image')}`)
            setImageId(`${searchParams.get('image')}`)
            setIsIdLink(true)
            setImageIsDisplayed(true)
        }
    }, [])
  
    const handleTextbarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setThumbnailText(event.target.value);
    };

    const handleKeyPress = async (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        await onGenerateThumbnail();
        event.preventDefault();
      }
    };
  
    const onGenerateThumbnail = async () => {
      const individualWords: any = thumbnailText.toLowerCase().match(/\b(\w+)\b/g)
      var invalidPrompt: boolean = false
      individualWords.forEach((element: any) => {
        if (words.includes(element)) {
          invalidPrompt = true
        }
      });

      if (invalidPrompt) {
        toast.error("Invalid Prompt Detected")
      } else {
        if (thumbnailText.length > 0) {
          setIsIdLink(false);
          setImageIsDisplayed(true);
          setIsLoading(true);
          toast.success('Thumbnail Generating');
          await submitThumbnailData(thumbnailText);
          const my_imageId = await generateImage(thumbnailText, apiHost, engineId, apiKey, setImageUrl);
          setImageId(my_imageId)
          setSearchParams({"image": my_imageId})
          setIsLoading(false);
        } else {
          toast.error("Please Describe Your Thumbnail")
        }
      }
    };

    const onRefreshThumbnail = async () => {
      setIsIdLink(false);
      setImageIsDisplayed(true);
      setIsLoading(true);
      await submitIPData(thumbnailText);
      const my_imageId = await generateImage(thumbnailText, apiHost, engineId, apiKey, setImageUrl);
      setImageId(my_imageId)
      setIsLoading(false);
    };

    const onDownloadWatermark = async () => {
      await updateImageData(imageId, "download");
      await submitDownloadData(thumbnailText);
      const link = document.createElement("a");
      link.href = `${import.meta.env.VITE_APISERVER}/download/watermark?id=${imageId}`;
      link.click();
    }

    const onBuyImage = async () => {
      await updateImageData(imageId, "purchase");
      await submitBuyData(thumbnailText);
    }

    return (
      <Grid container spacing={0} sx={{padding: '10px'}}>
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
          sx={{ ml: 0, mr: 0}}
        >
          <Item sx={{display: imageIsDisplayed ? 'block': 'none',pl: 0, pr: 0}}>
            <ProductDisplay
              isIdLink={isIdLink}
              isClicked={imageIsDisplayed}
              isLoading={isLoading}
              imageUrl={imageUrl}
              imageId={imageId}
              onRefreshThumbnail={onRefreshThumbnail}
              onDownloadWatermark={onDownloadWatermark}
              onPurchase={onBuyImage} />
          </Item>
          <Item>
            <GalleryComponent />
          </Item>
        </Grid>
        <Toaster />
    </Grid>
    )
}