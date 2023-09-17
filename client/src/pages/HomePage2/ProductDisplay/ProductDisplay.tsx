import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';
import PaymentsIcon from '@mui/icons-material/Payments';
import Skeleton from '@mui/material/Skeleton';

export default function ProductDisplay(props: {isClicked: boolean, isLoading: boolean, imageUrl: string, imageId: string, onRefreshThumbnail: any, onDownloadWatermark: any}) {
    
    return (
        <Container sx={{
            'min-height': '400px'
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
                        width: {
                            xs: 292, 
                            sm: 438,
                            md: 584 },
                        margin: '0 auto',
                    }}
                    variant="rectangular"
                    
                /> :
                <Box
                component="img"
                sx={{
                display:
                    props.isClicked && !props.isLoading ?
                    "inline-block":
                    "none",
                height: { 
                    xs: 200,
                    sm: 300,
                    md: 400
                },
                width: {
                    xs: 292, 
                    sm: 438,
                    md: 584 },
                margin: '0 auto',
                }}
                src={props.isClicked && !props.isLoading ? 
                    props.imageUrl:
                    props.imageUrl}
            />
            }
        <Stack spacing={0} alignItems="center" justifyContent="space-evenly" sx={{
            width: {
                xs: 292, 
                sm: 438,
                md: 584 },
            textAlign: 'center',
            margin: '0 auto',
            flexDirection: {
                xs: "column",
                sm: "row",
                md: "row" }
        }}>
            <Button
                sx={{
                    display: props.isClicked && !props.isLoading ? "inline-flex" : "none",
                    "text-align": "center",
                    margin: "0 2px",
                    bottom: '0px',
                    mt: 1,
                }}
                type="submit"
                color="info"
                variant="contained"
                onClick={props.onDownloadWatermark}
                endIcon={<DownloadIcon />}
            >Download
            </Button>
            <form action={`${import.meta.env.VITE_APISERVER}/create-checkout-session/?imgid=${props.imageId}`} method="POST">
                <Button
                    sx={{
                    display: 
                        props.isClicked && !props.isLoading ?
                        "inline-flex":
                        "none",
                    margin: "0 2px",
                    bottom: '0px',
                    mt: 1,
                    }}
                    type="submit"
                    color="success"
                    variant="contained"
                    endIcon={<PaymentsIcon />}
                >Buy
                </Button>
            </form>
            <Button 
                sx={{
                    display: props.isClicked && !props.isLoading ? "inline-flex" : "none",
                    "text-align": "center",
                    margin: "0 2px",
                    bottom: '0px',
                    mt: 1,
                }}
                onClick={props.onRefreshThumbnail}
                color="warning"
                variant="contained"
                endIcon={<RefreshIcon />}
            >
                Refresh
            </Button>
        </Stack>
      </Container>
    );
}