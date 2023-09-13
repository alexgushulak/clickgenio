import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar
  } from '@mui/material';
  import InfoIcon from '@mui/icons-material/Info';

function PhotoGallery(props: any) {
  const { photos } = props;
  return (
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <ImageList cols={photos.length} gap={3} style={{ flexWrap: 'nowrap', transform: 'translateZ(0)' }}>
        {photos.map((photo: any, index: number) => (
          <ImageListItem key={index} style={{ display: 'inline-block', width: 'calc(50% - 20px)' }}>
            <Card elevation={4} sx={{
              transition: 'transform 0.3s, boxShadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
              }
            }}>
              <CardActionArea>
                <img src={photo} loading="lazy" alt={`Image ${index}`} style={{ width: '100%', height: 'auto' }} />
              </CardActionArea>
              <ImageListItemBar
                position="below"
                title={"Users Thumbail descriptions"}
              />
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

export default PhotoGallery;
