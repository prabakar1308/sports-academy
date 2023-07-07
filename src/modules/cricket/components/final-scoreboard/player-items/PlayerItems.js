import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

import { WICKET_TYPES } from "../../../constants";
import "./PlayerItems.scss";

export default function PlayerItems({ isFirstInnings }) {
  const {
    scoreboard: { firstInnings, secondInnings },
  } = useSelector((state) => state.cricket);

  const innings = isFirstInnings ? firstInnings : secondInnings;
  const {
    players,
    batsmen1,
    batsmen2,
    totalRuns,
    totalBalls,
    wickets,
    balls,
    currentBowler,
    bowlers,
    extras,
  } = innings;

  const batsmenHeaders = [
    { gridSize: 7, name: "Batsmen" },
    { gridSize: 1, name: "R" },
    { gridSize: 1, name: "B" },
    { gridSize: 1, name: "4s" },
    { gridSize: 1, name: "6s" },
    { gridSize: 1, name: "SR" },
  ];

  const bowlerHeaders = [
    { gridSize: 7, name: "Bowler" },
    { gridSize: 1, name: "O" },
    { gridSize: 1, name: "M" },
    { gridSize: 1, name: "R" },
    { gridSize: 1, name: "W" },
    { gridSize: 1, name: "ER" },
  ];

  const currentBowlerExists =
    bowlers.findIndex((bow) => bow.id === currentBowler.id) >= 0;

  const getWicketDetails = (player, isBatting) => {
    const { wicketType, wicketHelpedBy, isOut, bowler } = player;
    if (wicketType && wicketHelpedBy && isOut) {
      if (wicketType.value === WICKET_TYPES.BOWLED) return `b ${bowler.name}`;
      else if (wicketType.value === WICKET_TYPES.CAUGHT) {
        if (wicketHelpedBy.id === bowler.id) {
          return `c  & b ${bowler.name}`;
        }
        return `c ${wicketHelpedBy.name} b ${bowler.name}`;
      }
    } else if (isBatting) {
      return "batting";
    }
    return "";
  };

  const getCurrentRunRate = () => {
    const crr = totalRuns && totalBalls ? (totalRuns / totalBalls) * 6 : 0;
    return Number.isInteger(crr) ? crr : parseFloat(crr).toFixed(2);
  };

  const getListItemHeader = (headerItems) => {
    return (
      <ListItem
        divider
        sx={{ backgroundColor: "#b4e5b1", borderRadius: "4px" }}
      >
        <Grid container spacing={1}>
          {headerItems.map((item, index) => (
            <Grid key={index} item xs={item.gridSize}>
              <ListItemText primary={item.name} />
            </Grid>
          ))}
        </Grid>
      </ListItem>
    );
  };

  const getListItem = (player, isBatting, index) => {
    return player ? (
      <ListItem divider key={index}>
        <Grid container spacing={1}>
          <Grid item xs={7}>
            <ListItemText
              className="player-name"
              primary={
                isBatting
                  ? `${player.name} ${player.isStriker ? "*" : ""}`
                  : player.name
              }
              secondary={getWicketDetails(player, isBatting)}
            />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.runs || 0} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.balls || 0} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.fours || 0} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.sixes || 0} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.strikeRate || 0} />
          </Grid>
        </Grid>
      </ListItem>
    ) : (
      <></>
    );
  };

  const getBowlerListItem = (player, index) => {
    return player ? (
      <ListItem divider key={index}>
        <Grid container spacing={1}>
          <Grid item xs={7}>
            <ListItemText className="player-name" primary={player.name} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText
              primary={`${parseInt(player.bowlingBalls / 6)}.${
                player.bowlingBalls % 6
              }`}
            />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.maidens || 0} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.bowlingRuns || 0} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.wickets || 0} />
          </Grid>
          <Grid item xs={1}>
            <ListItemText primary={player.econRate || 0} />
          </Grid>
        </Grid>
      </ListItem>
    ) : (
      <></>
    );
  };

  const getTotal = () => {
    const lastBall = balls && balls.length > 0 ? balls[balls.length - 1] : null;
    let overValue = 0;
    if (lastBall) {
      const { over, overBallNo } = lastBall;
      overValue = overBallNo === 6 ? over + 1 : `${over}.${overBallNo}`;
    }
    const score = `${totalRuns}-${wickets} (${overValue})`;
    return `Total  ${score}`;
  };

  const getCurrentBatsmen = (player, index) => {
    if (player && batsmen1 && player.id === batsmen1.id) {
      return getListItem(batsmen1, true, index);
    } else if (player && batsmen2 && player.id === batsmen2.id) {
      return getListItem(batsmen2, true, index);
    }
    return getListItem(player, true, index);
  };

  return (
    <List
      className="scoreboard-player-items"
      sx={{ width: "100%", bgcolor: "background.paper" }}
    >
      {getListItemHeader(batsmenHeaders)}
      {players.map((player, index) => {
        return player.isOut ? getListItem(player, false, index) : <></>;
      })}
      {/* current batting players */}
      {players.map((player, index) => {
        return player.isOut === false ? (
          getCurrentBatsmen(player, index)
        ) : (
          <></>
        );
      })}
      {/* {getListItem(batsmen1, true)}
      {getListItem(batsmen2, true)} */}
      {getListItemHeader(bowlerHeaders)}
      {bowlers.map((bowler, index) => {
        const bow =
          bowler.id === currentBowler.id ? currentBowler : { ...bowler };
        return getBowlerListItem(bow, index);
      })}
      {!currentBowlerExists && getBowlerListItem(currentBowler, 123)}
      <ListItem sx={{ backgroundColor: "#e6f8e2", borderRadius: "4px" }}>
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent={"space-between"}
        >
          <Grid item xs={4}>
            <ListItemText primary={`Extras: ${extras}`} />
          </Grid>
          <Grid item xs={4}>
            <ListItemText primary={`CRR ${getCurrentRunRate()}`} />
          </Grid>
          <Grid item xs={4}>
            <ListItemText className="total-section" primary={getTotal()} />
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}
