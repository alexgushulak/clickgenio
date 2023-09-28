import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

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
              <h2>What People Are Making:</h2>
              {myImageData.map((item: any) => (
                <ImageListItem key={item.id} sx={{ width: {xs: '100%', sm:'50%'}, display: 'inline-block'}}>
                  <img
                    srcSet={item.s3url}
                    alt={item.title}
                  />
                  <ImageListItemBar
                    title={item.text}
                  />
                </ImageListItem>
              ))}
            </ImageList>
  );
}