import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function GalleryComponent() {
    const [myImageData, setMyImageData] = React.useState([])
    const [loadCount, setLoadCount] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [imgsLoaded, setImgsLoaded] = React.useState(false)

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_APISERVER}/gallery`)
            .then(res => res.json())
            .then(data => {
                const myImageData = data.images.map((item: any) => item)
                setMyImageData(myImageData)
                // example myImageData[0].s3url --> https://clickgenio-production.up.railway.app/download?id=1695926078898
                // convert this url to https://clickgenio-production.up.railway.app/download2/watermark?id=1695926078898
                myImageData.forEach((item: any) => {
                    item.s3url = item.s3url.replace("download", "download2/watermark")
                })
            })
    }, [loadCount])

    React.useEffect(() => {
      if (loadCount === myImageData.length) {
        console.log("All images loaded")
        setIsLoaded(true)
      }
    }, [loadCount])

    return (
      <div><h2>What People Are Making:</h2>
            <ImageList sx={{ display: isLoaded ? 'inline-block' : 'none', width: '100%', height: '80vh' }}>
              {myImageData.map((item: any) => (
                <ImageListItem key={item.id} sx={{ width: {xs: '100%', sm:'50%'}, display: 'inline-block'}}>
                  <img
                    srcSet={item.s3url}
                    alt={item.title}
                    onLoad={() => setLoadCount(loadCount + 1)}
                  />
                  <ImageListItemBar
                    title={item.text}
                  />
                </ImageListItem>
              ))}
            </ImageList>
        </div>
  );
}