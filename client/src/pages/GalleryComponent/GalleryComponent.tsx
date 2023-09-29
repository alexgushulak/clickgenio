import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import YouTubeThumbnail from '../../components/YoutubeThumbnail';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function GalleryComponent() {
    const [myImageData, setMyImageData] = React.useState([])

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_APISERVER}/gallery`)
            .then(res => res.json())
            .then(data => {
                const myImageData = data.images.map((item: any) => item)
                setMyImageData(myImageData)
                myImageData.forEach((item: any) => {
                    item.s3url = item.s3url.replace("download", "download2/watermark")
                })
                console.log(myImageData[0].s3url)
            })
    }, [])

    return (
            <ImageList sx={{ display: 'inline-block', width: '100%', height: '80vh' }}>
              <Typography variant='h4' sx={{mb: '30px'}}>Recent Thumbnails</Typography>
              <Grid container spacing={2}>
              {myImageData.map((item: any) => (
                  <YouTubeThumbnail imageSrc={item.s3url} title={item.text} />
              ))}
              </Grid>
            </ImageList>
  );
}