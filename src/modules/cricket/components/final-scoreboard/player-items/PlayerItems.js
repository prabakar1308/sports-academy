import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { WICKET_TYPES } from "../../../constants";
import ExtrasDialog from "../extras-dialog/ExtrasDialog";
import "./PlayerItems.scss";

export default function PlayerItems({
  isFirstInnings,
  firstInnings,
  secondInnings,
}) {
  const [showBadge, setShowBadge] = React.useState(true);
  const [showExtras, setShowExtras] = React.useState(null);
  // const {
  //   scoreboard: { firstInnings, secondInnings },
  // } = useSelector((state) => state.cricket);

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
    team,
  } = innings;

  const getExtras = () => {
    let wide = 0,
      noBall = 0,
      byes = 0;
    balls.forEach((ball) => {
      if (ball.wide) {
        wide = wide + 1 + ball.runs;
      } else if (ball.noBall) {
        noBall = noBall + 1;
      } else if (ball.byes) {
        byes = byes + ball.runs;
      }
    });
    return `${extras} (${wide} WD, ${noBall} NB, ${byes} B)`;
  };

  const batsmenHeaders = [
    { gridSize: 6, name: "Batsmen" },
    { gridSize: 1, name: "R" },
    { gridSize: 1, name: "B" },
    { gridSize: 1, name: "0s" },
    { gridSize: 1, name: "4s" },
    { gridSize: 1, name: "6s" },
    { gridSize: 1, name: "SR" },
    // { gridSize: 1, name: "" },
  ];

  const bowlerHeaders = [
    { gridSize: 6, name: "Bowler" },
    { gridSize: 1, name: "O" },
    { gridSize: 1, name: "M" },
    { gridSize: 1, name: "0s" },
    { gridSize: 1, name: "R" },
    { gridSize: 1, name: "W" },
    { gridSize: 1, name: "ER" },
    // { gridSize: 1, name: "" },
  ];

  const currentBowlerExists =
    bowlers.findIndex((bow) => bow.id === currentBowler.id) >= 0;

  const getWicketDetails = (player, isBatting) => {
    const { wicketType, wicketHelpedBy, isOut, bowler } = player;
    if (wicketType && isOut) {
      if (wicketType.value === WICKET_TYPES.BOWLED) return `b ${bowler.name}`;
      else if (wicketType.value === WICKET_TYPES.CAUGHT) {
        if (wicketHelpedBy.id === bowler.id) {
          return `c  & b ${bowler.name}`;
        }
        return `c ${wicketHelpedBy.name} b ${bowler.name}`;
      } else if (
        wicketType.value === WICKET_TYPES.RUNOUT ||
        wicketType.value === WICKET_TYPES.RUNOUT_OTHER
      ) {
        return `runout (${wicketHelpedBy.name})`;
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
      <ListItem
        divider
        key={index}
        sx={{ backgroundColor: isBatting ? "#eef5f2" : "white" }}
      >
        <Grid container spacing={1}>
          <Grid item xs={6}>
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
            <ListItemText
              sx={{ paddingTop: "7px" }}
              primary={player.runs || 0}
            />
          </Grid>
          <Grid item xs={1}>
            <ListItemText
              sx={{ paddingTop: "7px" }}
              primary={player.balls || 0}
            />
          </Grid>
          <Grid item xs={1}>
            <ListItemText
              sx={{ paddingTop: "7px" }}
              primary={player.dotBalls || 0}
            />
          </Grid>
          <Grid item xs={1}>
            <ListItemText
              sx={{ paddingTop: "7px" }}
              primary={player.fours || 0}
            />
          </Grid>
          <Grid item xs={1}>
            <ListItemText
              sx={{ paddingTop: "7px" }}
              primary={player.sixes || 0}
            />
          </Grid>
          <Grid item xs={1}>
            <ListItemText
              sx={{
                paddingTop: "7px",
                display: "flex",
                justifyContent: "center",
              }}
              primary={player.strikeRate || 0}
            />
          </Grid>
          {/* <Grid item xs={1}> */}
          {/* <AdjustIcon /> */}
          {/* <Badge badgeContent={4} color="secondary">
              <AdjustIcon />
            </Badge> */}
          {/* <Badge
              sx={{ margin: "8px 0 0 8px" }}
              badgeContent={player.dotBalls || 0}
              color="secondary"
              invisible={showBadge}
            >
              <MoreVertIcon onClick={() => setShowBadge(!showBadge)} />
            </Badge> */}
          {/* </Grid> */}
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
          <Grid item xs={6}>
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
            <ListItemText primary={player.bowlingDotBalls || 0} />
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
    const bowlingBalls = currentBowler ? currentBowler.bowlingBalls : 0;
    let overValue = 0;
    if (lastBall) {
      const { over, overBallNo } = lastBall;
      // WORKAROUND - to fix first ball wide or no ball
      const updatedOverBallNo =
        overBallNo === 1 && bowlingBalls % 6 === 0 ? 0 : overBallNo;
      overValue = overBallNo === 6 ? over + 1 : `${over}.${updatedOverBallNo}`;
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

  const getUpcomingBatsmens = (players) => {
    let data = "";
    [...players]
      .filter((p) => p.isOut === null)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((p) =>
        data
          ? (data = `${data}, ${p.name}`)
          : (data = `Yet To Bat--> ${p.name}`)
      );
    return data;
  };

  console.log(players);

  return (
    <>
      <List
        className="scoreboard-player-items"
        sx={{ width: "100%", bgcolor: "background.paper" }}
      >
        {getListItemHeader(batsmenHeaders)}
        {players
          .sort((a, b) => a.battingOrder - b.battingOrder)
          .map((player, index) => {
            if (player.isOut) return getListItem(player, false, index);
            else if (player.isOut === false)
              return getCurrentBatsmen(player, index);
            else <></>;
          })}
        {/* current batting players */}
        {/* {players.map((player, index) => {
        return player.isOut === false ? (
          getCurrentBatsmen(player, index)
        ) : (
          <></>
        );
      })} */}
        {/* {getListItem(batsmen1, true)}
      {getListItem(batsmen2, true)} */}
        <Typography
          variant="caption"
          sx={{ textAlign: "left", padding: "10px 5px", display: "flex" }}
        >
          {getUpcomingBatsmens([...players])}
        </Typography>
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
            <Grid item xs={5}>
              <a
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowExtras({ balls, team, currentBowler, bowlers })
                }
              >
                <ListItemText primary={`${getExtras()}`} />
              </a>
            </Grid>
            <Grid item xs={3}>
              <ListItemText primary={`CRR ${getCurrentRunRate()}`} />
            </Grid>
            <Grid item xs={4}>
              <ListItemText className="total-section" primary={getTotal()} />
            </Grid>
          </Grid>
        </ListItem>
      </List>
      {showExtras && (
        <ExtrasDialog
          details={showExtras}
          handleClose={() => setShowExtras(null)}
        />
      )}
    </>
  );
}
