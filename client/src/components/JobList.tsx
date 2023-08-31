import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import JobInfo from './JobInfo';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 'padding': '20px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container
            className="main-page-container"
            maxWidth="md"
            sx={{'margin-top': {xs: 25, sm: 25}, 'margin-bottom': {xs: 75, sm: 0}}}
        >
    <Box
      className="job-list-box" sx={{ display: { sm: 'flex', xs: 'none' }, flexGrow: 1, bgcolor: '', 'min-height': 'auto', height: 'auto', 'justify-content': 'left', width: {sm: 'auto', md: 'auto'} }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '140px' }}
      >
        <Tab label="Volta Labs" {...a11yProps(0)} />
        <Tab label="Bosch" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
      <JobInfo
          companyName="Volta Labs"
          jobTitle="Thermal Engineer"
          jobDuty1="Built Python GUI that automated frequent temperature plotting and data entry tasks for research associates"
          jobDuty2="Forked open source firmware and built thermal control features used at customer product deployments."
          date="June 2021 - Present"/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <JobInfo 
          companyName="Bosch"
          jobTitle="Mech-E Co-op"
          jobDuty1="Wrote LabVIEW and MATLAB programs to monitor and analyze components (pumps, valves, heat exchangers, heaters)"
          jobDuty2="Implemented LIN communication protocol in LABVIEW to enable testing of propriety valve and firmware."
          date="January - October 2019"/>
      </TabPanel>
    </Box>
    <Box sx={{ display: { sm: 'none' }, flexGrow: 1, bgcolor: '', height: 1, 'justify-content': 'left', width: {sm: 500, md: 1000} }}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
      <Tab label="Volta Labs" {...a11yProps(0)} />
      <Tab label="Bosch" {...a11yProps(1)} />
    </Tabs>
  </Box>
  <TabPanel value={value} index={0}>
        <JobInfo
          companyName="Volta Labs"
          jobTitle="Thermal Engineer"
          jobDuty2="Built Python GUI that automated frequent temperature plotting and data entry tasks for research associates"
          jobDuty1="Forked open source firmware and built thermal control features used at customer product deployments."
          date="June 2021 - Present"/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <JobInfo 
          companyName="Bosch"
          jobTitle="Mech-E Co-op"
          jobDuty1="Wrote LabVIEW and MATLAB programs to monitor and analyze components (pumps, valves, HXs, heaters)."
          jobDuty2="Implemented LIN communication protocol and designed control scheme to enable system testing of valves."
          date="January - October 2019"/>
      </TabPanel>
    </Box>

    </Container>
  );
}