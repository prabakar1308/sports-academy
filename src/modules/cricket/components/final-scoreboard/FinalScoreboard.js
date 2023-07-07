import * as React from "react";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
// import Button from "@mui/material/Button";

import PlayerItems from "./player-items/PlayerItems";
// import { useNavigate } from "react-router-dom";

import "./FinalScoreboard.scss";

export default function FinalScoreboard() {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const navigate = useNavigate();
  const {
    matchDetails: { team1, team2, battingFirst },
    scoreboard: { isFirstInnings, firstInnings, secondInnings, isMatchStarted },
  } = useSelector((state) => state.cricket);

  const navigate = useNavigate();
  const [firstPanel, setFirstPanel] = React.useState(isFirstInnings);
  const [secondPanel, setSecondPanel] = React.useState(!isFirstInnings);

  React.useEffect(() => {
    if (!isMatchStarted) {
      navigate("/cricket/new-match");
    }
  }, []);

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
    const score = `${totalRuns}-${wickets} (${overValue} Ov)`;
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
          <Typography variant="h6">{getTotal(true)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PlayerItems isFirstInnings={true} />
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

            <Typography variant="h6">{getTotal(false)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PlayerItems isFirstInnings={false} />
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
    </div>
  );
}
