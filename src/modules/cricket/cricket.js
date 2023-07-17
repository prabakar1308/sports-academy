import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import AvatarIcon from "../../components/avatar-icon/AvatarIcon";
import { setDoc, deleteDoc, doc, Timestamp } from "firebase/firestore/lite";

import CardComponent from "../../components/card/Card";

import { db } from "../../database/firebase.db";
import { getRequiredRunDetails } from "./utils";
import "./cricket.scss";
import * as cricketActions from "../../store/actions/cricket";
import { updatePlayersFirebase } from "./db-operations";

const Cricket = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    matchDetails,
    matchDetails: { overs, team1Players, team2Players },
    scoreboardEntries,
    scoreboard,
    scoreboard: {
      isFirstInnings,
      firstInnings,
      secondInnings,
      resultText,
      isMatchCompleted,
      isMatchStarted,
    },
  } = useSelector((state) => state.cricket);

  const { totalRuns, team, totalBalls, players: players1 } = firstInnings;
  const {
    totalRuns: totalRuns2,
    totalBalls: totalBalls2,
    wickets,
    balls,
    team: team2,
    players: players2,
    currentBowler,
  } = secondInnings;

  const { runsRequired, rrr, remainingBalls } = getRequiredRunDetails({
    balls,
    overs,
    totalRuns,
    totalRuns2,
    wickets,
    bowlingBalls: currentBowler ? currentBowler.bowlingBalls : 0,
  });

  const cardList = [
    {
      title: "New League Match",
      description: "Manages scoreboard",
      image: require("../../images/cricket.jpg"),
      link: "/cricket/new-match",
      handleClick: () => dispatch(cricketActions.resetMatchDetails()),
    },
    {
      title: "View Matches",
      description: "View the list of matches played",
      image: require("../../images/cricket-tournament.jpg"),
      link: "/cricket/matches",
    },
    {
      title: "View Players",
      description: "View player profile",
      image: require("../../images/cricket-teams.jpg"),
      link: "/cricket/new-match",
    },
  ];

  React.useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.history.pushState(null, null, location.href);
    window.onpopstate = function (event) {
      window.history.go(1);
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  React.useEffect(() => {
    if (scoreboardEntries.length > 1 && (!isFirstInnings || isMatchCompleted)) {
      // update match in db
      console.log("match updated in DB");
      updateMatch(scoreboard, matchDetails);

      // update players in db
      if (isMatchCompleted) {
        const players = [...team1Players, ...team2Players];
        updatePlayersFirebase(players);
      }
    }
  }, [isFirstInnings, isMatchCompleted]);

  const getHeader = () => {
    let title = "Cricket";
    if (location.pathname === "/cricket/settings") {
      title = "Advanced Options";
    } else if (location.pathname === "/cricket/new-match") {
      title = "Select Teams";
    }
    return title;
  };

  const getSecondaryTitle = () => {
    if (resultText) return resultText;
    const req = Number.isInteger(rrr) ? rrr : parseFloat(rrr).toFixed(2);
    // const title2 = `${team2.name} needs ${runsRequired} from ${remainingBalls} balls (RRR: ${req})`;

    const crr2 = totalRuns2 && totalBalls2 ? (totalRuns2 / totalBalls2) * 6 : 0;
    const curr2 = Number.isInteger(crr2) ? crr2 : parseFloat(crr2).toFixed(2);
    const title2 = `Required ${runsRequired} off ${remainingBalls} (CRR: ${curr2}, RRR: ${req})`;

    const crr = totalRuns && totalBalls ? (totalRuns / totalBalls) * 6 : 0;
    const curr = Number.isInteger(crr) ? crr : parseFloat(crr).toFixed(2);
    const title = `CRR: ${curr}`;
    return isFirstInnings ? title : title2;
  };

  const navigatePath = () => {
    let url = "/cricket/finalscore";
    if (location.pathname === "/cricket/finalscore") {
      url = "/cricket/scoreboard";
    }
    navigate(url);
  };

  return (
    <div className="cric-dashboard">
      {(location.pathname === "/cricket/finalscore" ||
        location.pathname === "/cricket/scoreboard") &&
      isMatchStarted ? (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            backgroundImage: "linear-gradient(#5c979e, #23d39a);",
            margin: "8px 0",
            borderRadius: "4px",
            color: "white",
          }}
        >
          <ListItem sx={{ width: "80%" }}>
            <ListItemText
              primary={
                <span>
                  <span className={isFirstInnings ? "team-name-highlight" : ""}>
                    {team.name}
                  </span>{" "}
                  vs{" "}
                  <span
                    className={!isFirstInnings ? "team-name-highlight" : ""}
                  >
                    {team2.name}
                  </span>
                </span>
              }
              secondary={
                <span className="secondary-title">{getSecondaryTitle()}</span>
              }
            />
          </ListItem>
          <ListItem sx={{ width: "20%" }} className="secondary-section">
            {/* {!isFirstInnings && (
              <ListItemText
                primary={`${team2.name} (RRR - ${
                  Number.isInteger(rrr) ? rrr : parseFloat(rrr).toFixed(2)
                })`}
                secondary={`Needs ${runsRequired} from ${remainingBalls} balls`}
              />
            )} */}

            {!isMatchCompleted && (
              <ListItemAvatar>
                <AvatarIcon
                  icon={<ScoreboardIcon />}
                  handleClick={() => navigatePath()}
                  tooltip="Update Score"
                />
              </ListItemAvatar>
            )}
          </ListItem>
        </List>
      ) : (
        <Typography className="cric-header" variant="h6">
          {getHeader()}
        </Typography>
      )}

      {location.pathname === "/cricket" && (
        <Grid sx={{ flexGrow: 2 }} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              {cardList.map((value, index) => (
                <Grid key={index} item>
                  <CardComponent details={value} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
      {/* <button onClick={() => updatePlayersFirebase(team1Players)}>
        testtt
      </button> */}
      <Outlet />
    </div>
  );
};

const updateMatch = async (scoreboard, matchDetails) => {
  try {
    const client = JSON.parse(sessionStorage.getItem("client"));
    const data = {
      clientId: client ? client.clientId : 0,
      matchId: scoreboard.matchId,
      matchDetails,
      scoreboard,
      created: Timestamp.now(),
    };
    await setDoc(doc(db, "matches", scoreboard.matchId), data);
  } catch (err) {
    alert(err);
  }
};

export default Cricket;
