import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React from 'react';
import styled from 'styled-components';

const YoutubeThumbnail = styled.img`
  float: left;
  border-radius: 7px;
  object-fit: cover;
  width: 100px;
  padding: 3px;
  height: 67px;
`;

const containerStyle = {
    width: {xs: '300px', sm: '400px', md: '520px'},
    margin: '0 auto'
}

export default function GalleryGrid() {
    const [myImageData, setMyImageData] = React.useState([])

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_APISERVER}/gallery`)
            .then(res => res.json())
            .then(data => {
                const myImageData = data.images.map((item: any) => item)
                setMyImageData(myImageData)
                myImageData.forEach((item: any) => {
                    item.previewUrl = `${import.meta.env.VITE_APISERVER}/image-cache/${item.imageId}.jpg`
                })
            })
    }, [])

    return (
        <Grid container spacing={2} sx={containerStyle}>
            {myImageData.map((item: any) => (
                <YoutubeThumbnail key={item.previewUrl} src={item.previewUrl} />
            ))}
        </Grid>
    )
}