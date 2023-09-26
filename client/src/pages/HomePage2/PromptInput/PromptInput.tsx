import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import { generateImage, submitThumbnailData } from "../../../services/apiLayer";
import CustomizedSnackbars from '../SnackBar';
import ButtonGroup from './ButtonGroup';


export default function PromptInput(props: {thumbnailText: string, handleTextbarChange: any, handleKeyPress: any, onGenerateThumbnail: any, isLoading: boolean}) {
    return (
        <div>
        <TextField
              sx={{
                borderColor: 'red'
              }}
              color='secondary'
              fullWidth={true}
              value={props.thumbnailText}
              onChange={props.handleTextbarChange}
              onKeyDown={props.handleKeyPress}
              label="Describe Your Thumbnail"
              placeholder="A Rainbow Colored Tesla Model 3 Driving Through the Mountains"
              id="outlined-multiline-flexible"
              multiline
            />
            <Button
              className="btn-hover color-10"
              variant="contained"
              onClick={props.onGenerateThumbnail}
              sx={{
                  display: props.isLoading ? "none" : "block",
                  "text-align": "center",
                  margin: "0 auto",
                  width: '100%',
                  mt: 1,
              }}
            >
            GENERATE YOUR FREE THUMBNAIL
            </Button>
            {props.isLoading && (
              <div style={{
                marginTop: '10px',
                textTransform: "uppercase",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CustomizedSnackbars
                  severity="success"
                  message="Please wait 30 seconds for the thumbnail to generate"
                />
                Please wait 30 seconds for the thumbnail to generate <CircularProgress sx={{padding: '10px'}}/>
              </div>
            )}
        </div>
    )
}