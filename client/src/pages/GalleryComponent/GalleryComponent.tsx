import ImageList from '@mui/material/ImageList';
import YouTubeThumbnail from '../../components/YoutubeThumbnail';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useGallery from '../../hooks/useGallery';

export default function GalleryComponent() {
    const [myImageData, setMyImageData] = useGallery()



    return (
        <div>
            <Typography variant='h4' sx={{mb: '0px'}}>Recent Thumbnails</Typography>
            <ImageList sx={{ display: 'inline-block', width: '100%', height: '80vh' }}>
            <Grid container spacing={2}>
            {myImageData.map((item: any) => (
                <YouTubeThumbnail key={item.imageData} imageSrc={item.previewUrl} title={item.userPrompt} viewCount={item.viewCount} />
            ))}
            </Grid>
            </ImageList>
        </div>
    )
}