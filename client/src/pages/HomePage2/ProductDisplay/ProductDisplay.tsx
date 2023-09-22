import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';
import PaymentsIcon from '@mui/icons-material/Payments';
import Skeleton from '@mui/material/Skeleton';
import RainbowButton from './RainbowButton';
import './style.css';
import CustomizedSnackbars from '../SnackBar';

export default function ProductDisplay(props: {isClicked: boolean, isLoading: boolean, imageUrl: string, imageId: string, onRefreshThumbnail: any, onDownloadWatermark: any}) {
    
    return (
        <Container sx={{
            'min-height': '400px',
            'width': '100%',
        }}>
            {
                props.isLoading ?
                <Skeleton
                    sx={{
                        bgcolor: 'grey.900',
                        height: { 
                            xs: 200,
                            sm: 300,
                            md: 400
                        },
                        width: '100%',
                        margin: '0 auto',
                    }}
                    variant="rectangular"
                    
                /> :
                <div>
                <div style={{textTransform: "uppercase"}}>
                    <CustomizedSnackbars message="Thumbnail Generated! Please Scroll Down to View" />
                </div>
                <Box
                component="img"
                sx={{
                display:
                    props.isClicked && !props.isLoading ?
                    "inline-block":
                    "none",
                    margin: '0 auto',
                    width: '100%',
                }}
                src={props.isClicked && !props.isLoading ? 
                    props.imageUrl:
                    props.imageUrl}
            /></div>
            }
        <Stack spacing={0} alignItems="center" justifyContent="space-evenly" sx={{
            width: {
                xs: 292, 
                sm: 438,
                md: 384 },
            textAlign: 'center',
            margin: '10px auto',
            flexDirection: {
                xs: "row",
                sm: "row",
                md: "row" }
        }}>
            <form action={`${import.meta.env.VITE_APISERVER}/create-checkout-session/?imgid=${props.imageId}`} method="POST">
                <Button
                    className="btn-hover color-1"
                    sx={{
                        display: props.isClicked && !props.isLoading ? "inline-flex" : "none",
                        "text-align": "center",
                        margin: "0 10px",
                        bottom: '0px',
                        mt: 1,
                        fontSize: '13px',
                        border: '1px solid black'
                    }}
                    type="submit"
                    color="warning"
                    variant="contained"
                >
                    <strong>BUY HD THUMBNAIL</strong>
                </Button>
            </form>
            <IconButton
                className="btn-hover color-9"
                sx={{
                    display: props.isClicked && !props.isLoading ? "inline-flex" : "none",
                    "text-align": "center",
                    margin: "0 2px",
                    bottom: '0px',
                    mt: 1,
                    border: '1px solid black',
                    width: '45px'
                }}
                type="submit"
                onClick={props.onDownloadWatermark}
            >
                <DownloadIcon/>
            </IconButton>
            <IconButton
                className="btn-hover color-8"
                sx={{
                    display: props.isClicked && !props.isLoading ? "inline-flex" : "none",
                    "text-align": "center",
                    margin: "0 2px",
                    bottom: '0px',
                    mt: 1,
                    border: '1px solid black',
                    width: '45px'
                }}
                onClick={props.onRefreshThumbnail}
            >
            <CachedIcon/>
            </IconButton>
        </Stack>
      </Container>
    );
}