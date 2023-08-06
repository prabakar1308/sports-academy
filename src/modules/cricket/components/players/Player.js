import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import PlayerSearch from "./player-search/PlayerSearch";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PlayerStats from "./player-stats/PlayerStats";
import "./Player.scss";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      // hidden={value !== index}
      id={`players-tabpanel-${index}`}
      aria-labelledby={`players-tab-${index}`}
      {...other}
    >
      {
        <Box sx={{ p: 3, display: value === index ? "block" : "none" }}>
          {children}
        </Box>
      }
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `players-tab-${index}`,
    "aria-controls": `players-tabpanel-${index}`,
  };
}

export default function PlayersHome() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    // <Box
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "center",
    //   }}
    // >
    //   {/* <div>Players - Development In Progress</div> */}
    //   {/* <br /> */}
    //   {/* <CircularProgress /> */}
    //   {/* <BasicSpeedDial /> */}
    //   <PlayerSearch />
    // </Box>
    <div className="player-comp-wrapper">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="player tabs"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Stats" {...a11yProps(0)} />
          <Tab label="Match Wise" {...a11yProps(1)} />
          <Tab label="Compare" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PlayerStats />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PlayerSearch />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Development - In Progress
      </CustomTabPanel>
    </div>
  );
}
