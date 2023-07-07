import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import BlockIcon from "@mui/icons-material/Block";

import * as cricketActions from "../../../../../store/actions/cricket";
import NewInningsDialog from "../new-innings-dialog/NewInningsDialog";
import AvatarIcon from "../../../../../components/avatar-icon/AvatarIcon";
import EndMatchDialog from "../end-match-dialog/EndMatchDialog";
import { getRequiredRunDetails } from "../../../utils";
import "./MainScore.scss";

export default function MainScore() {
  const {
    matchDetails: { overs, playersPerTeam },
    scoreboard: { isFirstInnings, firstInnings, secondInnings },
  } = useSelector((state) => state.cricket);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [endDialog, setEndDialog] = React.useState(false);

  const innings = isFirstInnings ? firstInnings : secondInnings;
  const { totalRuns, wickets, balls, batsmen1 } = innings;
  const { totalRuns: totalRuns1, team: team1 } = firstInnings;
  const {
    totalRuns: totalRuns2,
    team: team2,
    wickets: wickets2,
  } = secondInnings;

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
    isFirstInnings,
  });

  const startNewInnings = (data) => {
    setOpenDialog(false);
    if (data) {
      dispatch(cricketActions.endInnings(data));
    }
  };

  const endMatch = (data) => {
    setEndDialog(false);
    if (data) {
      dispatch(cricketActions.endCricketMatch(data));
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
          {batsmen1 && (
            <AvatarIcon
              icon={<ScoreboardIcon />}
              handleClick={() => navigate("/cricket/finalscore")}
              tooltip="Detailed Scoreboard"
            />
          )}
          {(!batsmen1 || isFirstInnings) && (
            <AvatarIcon
              icon={<BlockIcon />}
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
            (player) => player.isOut === null
          )}
          bowlers={firstInnings?.players}
          remainingOvers={remainingOvers}
          stopInnings={playersPerTeam !== firstInnings.wickets + 1}
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
        />
      )}
    </div>
  );
}
