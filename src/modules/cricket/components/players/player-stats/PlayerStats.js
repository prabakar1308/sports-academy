import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import AutoCompleteAsync from "../../autocomplete-async/AutoCompleteAsync";
import "./PlayerStats.scss";
import { calcBatAverage, calcBowAverage } from "../../../utils";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "60px",
}));

// const darkTheme = createTheme({ palette: { mode: "dark" } });
// const lightTheme = createTheme({ palette: { mode: "light" } });

export default function PlayerStats() {
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const handleChange = (val) => {
    console.log(val);
    setSelectedPlayer(val);
  };

  const img = require("../../../../../images/virat-profile.jpg");

  const getContainer = ({ isImage, key, value, isHeader }) => {
    return (
      <>
        {isHeader ? (
          <Typography variant="h6">{value}</Typography>
        ) : (
          <Box
            sx={{
              p: 0,
              bgcolor: "background.default",
              display: "grid",
              gridTemplateColumns: { md: "1fr 1fr" },
              gap: 1,
            }}
          >
            {/* {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((elevation) => ( */}
            <Item
              key={10}
              elevation={10}
              sx={{
                height: isImage ? "120px" : "35px",
                display: "flex",
                alignItems: "center",
                margin: "0 40px",
                backgroundColor: "#6a7d8e",
                color: "white",
              }}
            >
              {isImage ? (
                <img src={img} />
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  padding="0 15px"
                  width="100%"
                >
                  {key && <Typography variant="button">{key}</Typography>}
                  <Typography>{value}</Typography>
                </Stack>
              )}
            </Item>
            {/* ))} */}
          </Box>
        )}
      </>
    );
  };

  // const calcBowAverage = ({ wickets, bowlingRuns }) => {
  //   if (wickets > 0 && bowlingRuns > 0) {
  //     const avg = bowlingRuns / wickets;
  //     return Number.isInteger(avg) ? avg : parseFloat(avg).toFixed(2);
  //   }
  //   return "-";
  // };

  // const calcBatAverage = ({ outs, runs }) => {
  //   if (runs > 0 && outs > 0) {
  //     const avg = runs / outs;
  //     return Number.isInteger(avg) ? avg : parseFloat(avg).toFixed(2);
  //   }
  //   return "-";
  // };

  const calcBestBowling = ({ bestBowlingWickets, bestBowlingRuns }) => {
    if (bestBowlingWickets > 0)
      return `${bestBowlingWickets}/${bestBowlingRuns}`;
    return "-";
  };

  const calcStrikeRate = ({ runs, balls }) => {
    if (runs > 0 && balls > 0) {
      const sr = (runs * 100) / balls;
      return Number.isInteger(sr) ? sr : parseFloat(sr).toFixed(2);
    }
    return "-";
  };

  const calcEconRate = ({ bowlingRuns, bowlingBalls }) => {
    if (bowlingBalls > 0) {
      const er = (bowlingRuns / bowlingBalls) * 6;
      return Number.isInteger(er) ? er : parseFloat(er).toFixed(2);
    }
    return "-";
  };

  const bowlingDetails =
    selectedPlayer && selectedPlayer.bowlingInnings > 0
      ? [
          { key: "", value: "Bowling Records", isHeader: true, size: 12 },
          { key: "Innings", value: selectedPlayer.bowlingInnings, size: 12 },
          { key: "Overs", value: selectedPlayer.overs, size: 12 },
          { key: "Maiden Overs", value: selectedPlayer.maidens, size: 12 },

          {
            key: "Balls Bowled",
            value: selectedPlayer.bowlingBalls,
            size: 12,
          },
          {
            key: "Dot Balls Bowled",
            value: selectedPlayer.bowlingDotBalls,
            size: 12,
          },
          { key: "Runs Conceded", value: selectedPlayer.bowlingRuns, size: 12 },
          { key: "Wickets", value: selectedPlayer.wickets, size: 12 },
          { key: "Average", value: calcBowAverage(selectedPlayer), size: 12 },
          {
            key: "Economy Rate",
            value: calcEconRate(selectedPlayer),
            size: 12,
          },
          {
            key: "Best Bowling",
            value: calcBestBowling(selectedPlayer),
            size: 12,
          },
          { key: "Wide Balls", value: selectedPlayer.wides, size: 12 },
          { key: "No Balls", value: selectedPlayer.noBalls, size: 12 },
          {
            key: "Sixes Conceded",
            value: selectedPlayer.sixesConceded,
            size: 12,
          },
          {
            key: "Fours Conceded",
            value: selectedPlayer.foursConceded,
            size: 12,
          },
        ]
      : [];

  const details = selectedPlayer
    ? [
        { key: "Matches", value: selectedPlayer.matches, size: 12 },
        { key: "", value: "Batting Records", isHeader: true, size: 12 },
        { key: "Innings", value: selectedPlayer.battingInnings, size: 12 },
        { key: "Runs Scored", value: selectedPlayer.runs, size: 12 },
        {
          key: "Highest Score",
          value: `${selectedPlayer.highestScore}${
            selectedPlayer.highestScoreNotOut ? "*" : ""
          }`,
          size: 12,
        },
        { key: "Average", value: calcBatAverage(selectedPlayer), size: 12 },
        { key: "Strike Rate", value: calcStrikeRate(selectedPlayer), size: 12 },
        { key: "Balls Faced", value: selectedPlayer.balls, size: 12 },
        { key: "Dot Balls", value: selectedPlayer.dotBalls, size: 12 },
        { key: "Fours", value: selectedPlayer.fours, size: 12 },
        { key: "Sixes", value: selectedPlayer.sixes, size: 12 },
        { key: "Catches", value: selectedPlayer.catches, size: 12 },
        ...bowlingDetails,
      ]
    : [];

  return (
    <div className="player-stats-wrapper">
      <AutoCompleteAsync
        id="player-ac"
        teamId={null}
        placeholder="Search Players"
        handleChange={handleChange}
        width={250}
      />
      {selectedPlayer && (
        <>
          <Grid container spacing={2}>
            {/* {[lightTheme, darkTheme].map((theme, index) => ( */}
            <Grid item xs={2}></Grid>
            <Grid item xs={8} key={"index"} sx={{ margin: "25px 0 10px" }}>
              {getContainer({ isImage: true })}
            </Grid>
            <Grid item xs={2}></Grid>
            {details.map((det, index) => (
              <Grid item xs={det.size} key={index} className="detail-grid">
                {getContainer({
                  key: det.key,
                  value: det.value,
                  isHeader: det.isHeader,
                })}
              </Grid>
            ))}

            {/* ))} */}
          </Grid>
        </>
      )}
    </div>
  );
}
