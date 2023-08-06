import * as React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import ToggleButtons from "../../../../../components/toggleButton/ToggleButton";
import { MATCH_RESULTS } from "../../../constants";
import "./EndMatchDialog.scss";

export default function EndMatchDialog(props) {
  const {
    onClose,
    open,
    runMargin,
    remainingwickets,
    team1,
    team2,
    remainingOvers,
    allWickets = false,
    forceStop = false,
  } = props;
  // const bowlerItems = bowlers.map((bow) => ({ ...bow, value: bow.name }));
  // const batsmenItems = players.map((bat) => ({ ...bat, value: bat.name }));

  const matchResults = [
    { id: 1, value: MATCH_RESULTS.WIN, disabled: false },
    { id: 2, value: MATCH_RESULTS.TIE, disabled: runMargin === 0 },
    { id: 3, value: MATCH_RESULTS.ABONDONED, disabled: allWickets },
    { id: 4, value: MATCH_RESULTS.DRS, disabled: allWickets },
  ];

  const [matchResult, setMatchResult] = React.useState(matchResults[0]);
  const [teamWon, setTeamWon] = React.useState(null);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    console.log(matchResult);
    let res = "";
    if (matchResult.value === MATCH_RESULTS.ABONDONED) {
      res = "No Result!";
    } else {
      if (runMargin > 0) {
        setTeamWon(team1);
        res = `${team1.name} won by ${runMargin} runs!`;
      } else if (runMargin < 0) {
        setTeamWon(team2);
        res = `${team2.name} won by ${remainingwickets} wickets!`;
      } else if (runMargin === 0) {
        res = "Match Tied!";
      }
    }
    setText(res);
  }, [matchResult]);

  return (
    <Dialog onClose={() => onClose(null)} open={open}>
      {/* <DialogTitle>Match Result</DialogTitle> */}

      <div className="end-innings-dialog-wrapper">
        {!allWickets && remainingOvers && runMargin > 0 ? (
          <>
            <Alert severity="warning">
              {remainingOvers} overs remaining in this innings!
            </Alert>
            <br />
            <div className="wicket-type">
              <Typography variant="subtitle2" gutterBottom>
                Match Result
              </Typography>
              <ToggleButtons
                id="match-result"
                items={matchResults}
                value={matchResult}
                handleSelection={(val) => setMatchResult(val)}
              />
            </div>
          </>
        ) : null}
        <br />
        <Alert severity="success">
          <AlertTitle>Match Result</AlertTitle>
          {text}
        </Alert>
        <Button
          variant="contained"
          onClick={() => onClose({ teamWon, resultText: text })}
          className="update-button"
        >
          FINISH
        </Button>

        {forceStop && (
          <Button
            variant="outlined"
            onClick={() => onClose(null)}
            className="update-button"
          >
            Cancel
          </Button>
        )}
      </div>
    </Dialog>
  );
}

EndMatchDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
};
