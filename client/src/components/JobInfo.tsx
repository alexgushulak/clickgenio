import '../App.css';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Typography } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

type AppProps = {
    companyName: string
    jobTitle: string
    jobDuty1: string
    jobDuty2: string
    date: String
};

export default function JobInfo({companyName, jobTitle, jobDuty1, jobDuty2, date }: AppProps) {
    return (
        <div>
            <Typography sx={{'font-size': {sm: '20px!important', md: '20px!important' }, justifyContent: {xs: 'left', sm: 'left'}}} className="job-header">{jobTitle} <span className="company-name-highlighted">&nbsp;@ {companyName}</span></Typography>
            <Typography sx={{'font-size': {sm: '14px!important', md: '14px!important' }, justifyContent: {xs: 'left', sm: 'left'}}} className="job-header">{date}</Typography>
            <List>
                <ListItem sx={{pl: '0px'}}>
                    <ListItemIcon sx={{minWidth: '25px', mb: '25px'}}>
                        < KeyboardArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={jobDuty1} />
                </ListItem>
                <ListItem sx={{pl: '0px'}}>
                    <ListItemIcon sx={{minWidth: '25px', mb: '25px'}}>
                        < KeyboardArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={jobDuty2} />
                </ListItem>
            </List>
        </div>
    );
}