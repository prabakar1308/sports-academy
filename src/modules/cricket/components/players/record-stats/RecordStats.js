import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./RecordStats.scss";
import RecordStatsList from "./record-stats-list/RecordStatsList";
import { useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { calcBatAverage, calcBowAverage } from "../../../utils";

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
        <Box sx={{ p: 0, display: value === index ? "block" : "none" }}>
          {children}
        </Box>
      }
    </div>
  );
}

export default function RecordStats() {
  const { players, teams } = useSelector((state) => state.cricket);
  const [value, setValue] = React.useState(0);
  const [displayResults, setDisplayResults] = React.useState([]);
  const [variant, setVariant] = React.useState("round");
  const keys = [
    { key: "runs", label: "Most Runs", sortOrder: "asc" },
    { key: "highestScore", label: "Highest Score", sortOrder: "asc" },
    { key: "sixes", label: "Most Sixes", sortOrder: "asc" },
    { key: "fours", label: "Most Fours", sortOrder: "asc" },
    { key: "wickets", label: "Most Wickets", sortOrder: "asc" },
    { key: "battingAvg", label: "Best Bat Avg", sortOrder: "asc" },
    { key: "bowlingAvg", label: "Best Bow Avg", sortOrder: "desc" },
    { key: "balls", label: "Most Balls Faced", sortOrder: "asc" },
    { key: "bowlingBalls", label: "Most Balls Bowled", sortOrder: "asc" },
    { key: "foursConceded", label: "Most Fours Conceded", sortOrder: "asc" },
    { key: "sixesConceded", label: "Most Sixes Conceded", sortOrder: "asc" },
  ];

  React.useEffect(() => {
    const res = generateListResults(0);
    setDisplayResults(res);
  }, [players]);

  React.useEffect(() => {
    console.log("dfdfdfdfdf", value);
    const res = generateListResults(value);
    setDisplayResults(res);
  }, [value]);

  const generateListResults = (index) => {
    const { key, sortOrder } = keys[index];
    if (
      key === "highestScore" ||
      key === "battingAvg" ||
      key === "bowlingAvg"
    ) {
      setVariant("square");
    } else {
      setVariant("round");
    }

    let updatedPlayers = players.filter((player) => player[key] > 0);
    if (key === "battingAvg") {
      updatedPlayers = players.filter(
        (player) => player.runs > 0 && player.outs > 0
      );
    } else if (key === "bowlingAvg") {
      updatedPlayers = players.filter(
        (player) => player.wickets > 0 && player.bowlingRuns > 0
      );
    }

    const res = updatedPlayers.map(
      ({
        name,
        teamId,
        [key]: value,
        highestScoreNotOut,
        outs,
        runs,
        wickets,
        bowlingRuns,
      }) => {
        let formattedValue = value;
        let origValue = value;
        if (key === "highestScore")
          formattedValue = `${value} ${highestScoreNotOut ? "*" : ""}`;
        else if (key === "battingAvg") {
          formattedValue = calcBatAverage({ outs, runs });
          origValue = formattedValue;
        } else if (key === "bowlingAvg") {
          formattedValue = calcBowAverage({ wickets, bowlingRuns });
          origValue = formattedValue;
        }
        const teamName = teams.filter((team) => team.id === teamId);
        return {
          name,
          team: teamName.length > 0 ? teamName[0].name : "NA",
          value: formattedValue,
          origValue,
        };
      }
    );
    //   .sort((a, b) => b.origValue - a.origValue);
    // console.log(res);

    const sortedData =
      sortOrder === "desc"
        ? res.sort((a, b) => a.origValue - b.origValue)
        : res.sort((a, b) => b.origValue - a.origValue);
    return sortedData;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const res = generateListResults(newValue);
    // console.log(res);
    setDisplayResults(res);
  };

  return (
    <div className="player-record-stats-wrapper">
      <Box
        sx={{
          //   maxWidth: { xs: 320, sm: 480 },
          margin: "0 -20px",
          padding: 0,
          bgcolor: "background.paper",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          textColor="secondary"
          indicatorColor="secondary"
          TabScrollButtonProps={{
            // onClick: (e, a) => console.log("d"),
            // onChange: (e, a) => console.log(a),
            slots: {
              EndScrollButtonIcon: () => (
                <IconButton onClick={() => setValue((prev) => prev + 1)}>
                  <ArrowCircleRightIcon />
                </IconButton>
              ),
              StartScrollButtonIcon: () => (
                <IconButton onClick={() => setValue((prev) => prev - 1)}>
                  <ArrowCircleLeftIcon />
                </IconButton>
              ),
            },
          }}
        >
          {keys.map(({ label }) => (
            <Tab label={label} />
          ))}
          {/* <Tab label="Most Runs" />
          <Tab label="Highest Score" />
          <Tab label="Most Sixes" />
          <Tab label="Most Fours" />
          <Tab label="Most Wickets" />
          <Tab label="Best Bat Avg" />
          <Tab label="Best Bow Avg" /> */}
        </Tabs>
      </Box>

      <RecordStatsList list={displayResults} variant={variant} />
      {/* <CustomTabPanel value={value} index={0}>
        <RecordStatsList list={displayResults} variant={"round"} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <RecordStatsList list={displayResults} variant={"square"} />
      </CustomTabPanel> */}
    </div>
  );
}
