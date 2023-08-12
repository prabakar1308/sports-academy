import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import PlayerSearch from "./player-search/PlayerSearch";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import PlayerStats from "./player-stats/PlayerStats";
import RecordStats from "./record-stats/RecordStats";
import * as cricketActions from "../../../../store/actions/cricket";
import * as genericActions from "../../../../store/actions/dashboard";
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
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const client = JSON.parse(sessionStorage.getItem("client"));
    dispatch(genericActions.switchProgressLoader(true));
    dispatch(cricketActions.getPlayersByClient(client ? client.clientId : 0));
  }, []);

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
          className="tabs-container"
        >
          <Tab label="Stats" {...a11yProps(0)} />
          <Tab label="Match Wise" {...a11yProps(1)} />
          <Tab label="Records" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PlayerStats />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PlayerSearch />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <RecordStats />
      </CustomTabPanel>
    </div>
  );
}
