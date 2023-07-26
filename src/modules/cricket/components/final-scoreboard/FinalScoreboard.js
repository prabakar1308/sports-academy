import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
// import Button from "@mui/material/Button";

import PlayerItems from "./player-items/PlayerItems";
// import { useNavigate } from "react-router-dom";

import "./FinalScoreboard.scss";
import OversDialog from "./overs-dialog/OversDialog";

export default function FinalScoreboard() {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const navigate = useNavigate();
  const {
    matchDetails: { team1, team2, battingFirst },
    scoreboard: {
      isFirstInnings,
      firstInnings,
      secondInnings,
      isMatchStarted,
      isMatchCompleted,
    },
  } = useSelector((state) => state.cricket);

  const navigate = useNavigate();
  const [firstPanel, setFirstPanel] = React.useState(isFirstInnings);
  const [secondPanel, setSecondPanel] = React.useState(!isFirstInnings);
  const [dialogDetails, setDialogDetails] = React.useState(null);

  React.useEffect(() => {
    if (!isMatchStarted) {
      navigate("/cricket");
    }
  }, []);

  React.useEffect(() => {
    if (isMatchCompleted) {
      setFirstPanel(true);
      setSecondPanel(true);
    }
  }, [isMatchCompleted]);

  const bowlingTeam =
    team1 && battingFirst && team1.id === battingFirst.id ? team2 : team1;

  const getTotal = (isFirstInnings) => {
    const innings = isFirstInnings ? firstInnings : secondInnings;
    const { totalRuns, wickets, balls } = innings;
    const lastBall = balls && balls.length > 0 ? balls[balls.length - 1] : null;
    let overValue = 0;
    if (lastBall) {
      const { over, overBallNo } = lastBall;
      overValue = overBallNo === 6 ? over + 1 : `${over}.${overBallNo}`;
    }
    const score = `${totalRuns}-${wickets} (${overValue})`;
    return `${score}`;
  };

  // const battingTitle = `${battingFirst ? battingFirst.name : ""}, 1st Innings`;
  // const battingDesc = `${totalRuns}-${wickets} (${
  //   balls && balls.length > 0 ? balls[balls.length] : 0
  // } overs)`;

  return (
    <div className="final-scoreboard-wrapper">
      {/* <Stack direction={"column"} spacing={2}>
        <MainScore />
        <BatsmenCard />
        <CurrentOver />
        <BallActions />
      </Stack> */}
      <Accordion
        expanded={firstPanel}
        onChange={() => setFirstPanel(!firstPanel)}
      >
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="team-header"
          sx={{
            backgroundColor: "#23d39a",
            color: "white",
            borderRadius: "4px",
          }}
        >
          <div>
            <Typography variant="h6">{battingFirst?.name}</Typography>&nbsp;
            <Typography variant="caption">1st Innings</Typography>
          </div>
          <div>
            <Typography variant="h6">{getTotal(true)}</Typography>
            {/* <AvatarIcon
              icon={<SportsBaseballIcon />}
              handleClick={(event) => {
                event.stopPropagation();
                console.log("sdsd");
              }}
              tooltip="View Balls"
            /> */}
            <SportsBaseballIcon
              sx={{ cursor: "pointer", paddingLeft: "2px" }}
              fontSize="small"
              onClick={(event) => {
                event.stopPropagation();
                setDialogDetails({
                  balls: firstInnings.balls,
                  team: firstInnings.team.name,
                });
              }}
            />
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <PlayerItems
            isFirstInnings={true}
            firstInnings={firstInnings}
            secondInnings={secondInnings}
          />
        </AccordionDetails>
      </Accordion>
      {!isFirstInnings && (
        <Accordion
          expanded={secondPanel}
          onChange={() => setSecondPanel(!secondPanel)}
        >
          <AccordionSummary
            // expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            className="team-header"
            sx={{
              backgroundColor: "#23d39a",
              color: "white",
              borderRadius: "4px",
            }}
          >
            <div>
              <Typography variant="h6">{bowlingTeam.name}</Typography>
              &nbsp;
              <Typography variant="caption">2nd Innings</Typography>
            </div>

            {/* <Typography variant="h6">{getTotal(false)}</Typography> */}
            <div>
              <Typography variant="h6">{getTotal(false)}</Typography>
              {/* <AvatarIcon
              icon={<SportsBaseballIcon />}
              handleClick={(event) => {
                event.stopPropagation();
                console.log("sdsd");
              }}
              tooltip="View Balls"
            /> */}
              <SportsBaseballIcon
                sx={{ cursor: "pointer", paddingLeft: "2px" }}
                fontSize="small"
                onClick={(event) => {
                  event.stopPropagation();
                  setDialogDetails({
                    balls: secondInnings.balls,
                    team: secondInnings.team.name,
                  });
                }}
              />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <PlayerItems
              isFirstInnings={false}
              firstInnings={firstInnings}
              secondInnings={secondInnings}
            />
          </AccordionDetails>
        </Accordion>
      )}
      {/* <br />
      <Button
        variant="outlined"
        onClick={() => navigate("/cricket/scoreboard")}
      >
        Live Scoreboard
      </Button>
      <br />
      <br /> */}
      {dialogDetails && (
        <OversDialog
          details={dialogDetails}
          handleClose={() => setDialogDetails(null)}
        />
      )}
    </div>
  );
}
