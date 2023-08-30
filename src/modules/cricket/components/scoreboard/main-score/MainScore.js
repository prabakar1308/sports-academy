import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import SaveIcon from "@mui/icons-material/Save";
import BlockIcon from "@mui/icons-material/Block";
import StartIcon from "@mui/icons-material/Start";
// import {
//   setDoc,
//   doc,
//   Timestamp,
//   addDoc,
//   collection,
// } from "firebase/firestore/lite";

// import { db } from "../../../../../database/firebase.db";
import * as cricketActions from "../../../../../store/actions/cricket";
import * as genericActions from "../../../../../store/actions/dashboard";
import NewInningsDialog from "../new-innings-dialog/NewInningsDialog";
import AvatarIcon from "../../../../../components/avatar-icon/AvatarIcon";
import EndMatchDialog from "../end-match-dialog/EndMatchDialog";
import {
  getNewPlayerDetails,
  getRequiredRunDetails,
  omitProps,
} from "../../../utils";
import "./MainScore.scss";

export default function MainScore() {
  const {
    matchDetails,
    scoreboard,
    matchDetails: { overs, playersPerTeam },
    scoreboard: { isFirstInnings, firstInnings, secondInnings },
    scoreboardEntries,
  } = useSelector((state) => state.cricket);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [endDialog, setEndDialog] = React.useState(false);

  const innings = isFirstInnings ? firstInnings : secondInnings;
  const { totalRuns, wickets, balls, batsmen1, currentBowler } = innings;
  console.log("batsmen1", batsmen1);
  const { totalRuns: totalRuns1, team: team1 } = firstInnings;
  const {
    totalRuns: totalRuns2,
    team: team2,
    wickets: wickets2,
  } = secondInnings;

  const battingTeam = isFirstInnings ? firstInnings.team : secondInnings.team;
  const bowlingTeam = isFirstInnings ? secondInnings.team : firstInnings.team;

  const title = (
    <div className="team-title">
      {innings && innings.team ? innings.team.name : ""}
      <span>{isFirstInnings ? "1st Innings" : "2nd Innings"}</span>
    </div>
  );

  const { score, remainingOvers } = getRequiredRunDetails({
    balls,
    overs,
    totalRuns,
    totalRuns2,
    wickets,
    bowlingBalls: currentBowler ? currentBowler.bowlingBalls : 0,
  });

  const getPlayerDetails = (player, team, inningsKey) => {
    const updatedPlayer = player ? omitProps("title", player) : null;
    if (updatedPlayer) {
      if (updatedPlayer.id) return updatedPlayer;
      else {
        const newPlayer = getNewPlayerDetails(updatedPlayer.name, team.id);
        // createPlayer(newPlayer);
        dispatch(
          cricketActions.addCricketPlayer({
            key: inningsKey,
            value: newPlayer,
          })
        );
        return newPlayer;
      }
    }
    return updatedPlayer;
  };

  const startNewInnings = (data) => {
    setOpenDialog(false);
    if (data) {
      let { striker, nonStriker, bowler, startLater, penaltyRuns } = data;
      // let striker, nonStriker, bowler = null;
      if (!startLater) {
        const battingTeam = isFirstInnings
          ? firstInnings.team
          : secondInnings.team;
        const bowlingTeam = isFirstInnings
          ? secondInnings.team
          : firstInnings.team;
        const inningsKey = isFirstInnings ? "firstInnings" : "secondInnings";
        const innings2Key = isFirstInnings ? "secondInnings" : "firstInnings";
        striker = getPlayerDetails(striker, battingTeam, inningsKey);
        nonStriker = getPlayerDetails(nonStriker, battingTeam, inningsKey);
        bowler = getPlayerDetails(bowler, bowlingTeam, innings2Key);
      }
      dispatch(
        cricketActions.endInnings({
          startLater,
          striker,
          nonStriker,
          bowler,
          penaltyRuns,
          unSavedActions: true,
        })
      );
    }
  };

  const endMatch = (data) => {
    setEndDialog(false);
    if (data) {
      dispatch(
        cricketActions.endCricketMatch({ ...data, unSavedActions: true })
      );
      navigate("/cricket/finalscore");
    }
  };

  return (
    <div className="main-score-wrapper">
      <Card
        sx={{
          minWidth: 275,
          // backgroundImage: "linear-gradient(#5c979e, #23d39a)",
          backgroundImage: "linear-gradient(#23d39a, lightseagreen)",
          // backgroundColor: "#23d39a",
          color: "white",
        }}
      >
        <CardContent sx={{ paddingBottom: 0 }}>
          {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
          <Typography variant="h5" component="div">
            {title}
          </Typography>

          <Typography variant="h6" component="div">
            {score}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          {/* {batsmen1 && (
            <AvatarIcon
              icon={<ScoreboardIcon />}
              handleClick={() => navigate("/cricket/finalscore")}
              tooltip="Detailed Scoreboard"
            />
          )} */}
          <AvatarIcon
            icon={<SaveIcon />}
            handleClick={() => {
              dispatch(genericActions.switchProgressLoader(true));
              dispatch(
                cricketActions.saveCricketMatch({
                  scoreboard,
                  matchDetails,
                  saveAction: true,
                })
              );
            }}
            disabled={!(scoreboardEntries.length > 1)}
            tooltip="Save Scoreboard"
          />
          {(!batsmen1 || isFirstInnings) && (
            <AvatarIcon
              icon={<StartIcon />}
              handleClick={() => setOpenDialog(true)}
              tooltip="Start Next Innings"
            />
          )}
          {batsmen1 && !isFirstInnings && (
            <AvatarIcon
              icon={<BlockIcon />}
              handleClick={() => setEndDialog(true)}
              tooltip="End Match"
            />
          )}
        </CardActions>
      </Card>

      {openDialog && (
        <NewInningsDialog
          open={openDialog}
          onClose={startNewInnings}
          players={secondInnings?.players.filter(
            (player) => player.isOut != null
          )}
          // bowlers={firstInnings?.players}
          remainingOvers={remainingOvers}
          stopInnings={
            isFirstInnings && playersPerTeam !== firstInnings.wickets + 1
          }
          isFirstInnings={isFirstInnings}
          battingTeam={isFirstInnings ? bowlingTeam : battingTeam}
          bowlingTeam={isFirstInnings ? battingTeam : bowlingTeam}
        />
      )}
      {endDialog && (
        <EndMatchDialog
          open={endDialog}
          onClose={endMatch}
          runMargin={totalRuns1 - totalRuns2}
          remainingwickets={playersPerTeam - wickets2 - 1}
          remainingOvers={remainingOvers}
          team1={team1}
          team2={team2}
          allWickets={playersPerTeam === wickets2 + 1}
          forceStop
        />
      )}
    </div>
  );
}

// const createPlayer = async (player) => {
//   try {
//     await setDoc(doc(db, "players", player.id), player);
//   } catch (err) {
//     alert(err);
//   }
// };
