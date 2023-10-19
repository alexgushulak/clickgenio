import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { generateImage, submitDownloadData, submitIPData, submitThumbnailData, submitBuyData, updateImageData, updateIsEmailOk, getCredits, deductCredits } from "../../services/apiLayer";
import ProductDisplay from "./ProductDisplay/ProductDisplay";
import TipsAndTricks from "./TipsAndTricks/TipsAndTricks";
import PromptInput from "./PromptInput/PromptInput";
import GalleryComponent from "../GalleryComponent/GalleryComponent";
import { useSearchParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import words from 'profane-words';
import Button from '@mui/material/Button';
import { useCookies } from 'react-cookie';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

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
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits']);
    
    useEffect(() => {
        if (searchParams.get('image')) {
            setImageUrl(`${import.meta.env.VITE_APISERVER}/download/watermark?id=${searchParams.get('image')}`)
            setImageId(`${searchParams.get('image')}`)
            setIsIdLink(true)
            setImageIsDisplayed(true)
        }

        if (searchParams.get('success') === 'true') {
          toast.success('Credits Purchased!')
        }
    }, [])
  
    const handleTextbarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setThumbnailText(event.target.value);
    };

    const handleKeyPress = async (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !isLoading) {
        event.preventDefault();
        await onGenerateThumbnail();
        event.preventDefault();
      }
    };
  
    const onGenerateThumbnail = async () => {
      if (thumbnailText.length <= 0) {
        toast.error("Please Describe Your Thumbnail")
        return
      }

      const individualWords: any = thumbnailText.toLowerCase().match(/\b(\w+)\b/g)
      var invalidPrompt: boolean = false
      individualWords.forEach((element: any) => {
        if (words.includes(element)) {
          invalidPrompt = true
        }
      });

      if (invalidPrompt) {
        toast.error("Invalid Prompt Detected")
        return
      }

      const response = await getCredits(cookies.token)
      if (response.credits <= 0) {
        toast.error("Please Purchase More Credits →")
        return
      }

      const creditResponse: any = await deductCredits(cookies.token)
      if (creditResponse.success != 'true') {
        toast.error("Could not deduct credits")
        return
      } else {
        setCookie('credits', response.credits-1)
      }

      toast.success('Thumbnail Generating');
      setIsIdLink(false);
      setImageIsDisplayed(true);
      setIsLoading(true);
      await submitThumbnailData(thumbnailText);
      const my_imageId = await generateImage(thumbnailText, apiHost, engineId, apiKey, setImageUrl);
      setImageId(my_imageId)
      setSearchParams({"image": my_imageId})
      setIsLoading(false);
    };

    const onRefreshThumbnail = async () => {
      const response = await getCredits(cookies.token)
      if (response.credits <= 0) {
        toast.error("Please Purchase More Credits →")
        return
      }

      const creditResponse: any = await deductCredits(cookies.token)
      if (creditResponse.success != 'true') {
        toast.error("Could not deduct credits")
        return
      } else {
        setCookie('credits', response.credits-1)
      }

      setIsIdLink(false);
      setImageIsDisplayed(true);
      setIsLoading(true);
      await submitIPData(thumbnailText);
      const my_imageId = await generateImage(thumbnailText, apiHost, engineId, apiKey, setImageUrl);
      setImageId(my_imageId)
      setIsLoading(false);
    };

    const onEarlyAccess = async () => {
      await updateIsEmailOk(cookies.token)
      toast.success("You Will Be E-mailed When This Feature is Ready!")
    }

    const onDownloadWatermark = async () => {
      await updateImageData(imageId, "download");
      await submitDownloadData(thumbnailText);
      const link = document.createElement("a");
      link.href = `${import.meta.env.VITE_APISERVER}/download/full?id=${imageId}`;
      link.click();
    }

    const onBuyImage = async () => {
      await updateImageData(imageId, "purchase");
      const link = document.createElement("a");
      link.href = `${import.meta.env.VITE_APISERVER}/download/full?id=${imageId}`;
      link.click();
      //await submitBuyData(thumbnailText);
    }

    return (
      <Container maxWidth="xl">
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
            <Box>
            Want to see your face in the thumbnail like these photos?
            <Button 
              sx={{margin: '10px'}}
              onClick={onEarlyAccess}
              variant="contained" >
            Register for Early Access
            </Button>
            </Box>
            <Box
              component="img"
              sx={{
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px',
                height: { xs: 172, sm: 215, md: 215 },
                width: { xs: 301, sm: 377, md: 370 },
              }}
              src={`${import.meta.env.VITE_APISERVER}/assets/alligator.png`}
            />
            <Box
              component="img"
              sx={{
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px',
                height: { xs: 172, sm: 215, md: 215 },
                width: { xs: 301, sm: 377, md: 370 },
              }}
              src={`${import.meta.env.VITE_APISERVER}/assets/lol.png`}
            />
            <Box
              component="img"
              sx={{
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px',
                height: { xs: 172, sm: 215, md: 215 },
                width: { xs: 301, sm: 377, md: 370 },
              }}
              src={`${import.meta.env.VITE_APISERVER}/assets/shark.png`}
            />
            <Box
              component="img"
              sx={{
                display: 'inline-block',
                margin: '0 auto',
                padding: '10px',
                height: { xs: 172, sm: 215, md: 215 },
                width: { xs: 301, sm: 377, md: 370 },
              }}
              src={`${import.meta.env.VITE_APISERVER}/assets/spaceman.png`}
            />
          </Item>
          <Item>
            <GalleryComponent />
          </Item>
        </Grid>
        <Toaster />
    </Grid>
      </Container>
    )
}