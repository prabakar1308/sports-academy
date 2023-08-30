import * as React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import "./NewInningsDialog.scss";
import AutocompleteDropdown from "../../../../../components/autocomplete-dropdown/AutocompleteDropdown";
import { TextField } from "@mui/material";
import AutoCompleteAsync from "../../autocomplete-async/AutoCompleteAsync";

export default function NewInningsDialog(props) {
  const {
    onClose,
    open,
    players = [],
    // bowlers = [],
    remainingOvers,
    stopInnings = false,
    isFirstInnings,
    battingTeam,
    bowlingTeam,
  } = props;
  // const bowlerItems = bowlers.map((bow) => ({ ...bow, title: bow.name }));
  // const batsmenItems = players.map((bat) => ({ ...bat, title: bat.name }));

  const [striker, setStriker] = React.useState(null);
  const [nonStriker, setNonStriker] = React.useState(null);
  const [bowler, setBowler] = React.useState(null);
  const [penaltyRuns, setPenaltyRuns] = React.useState(0);

  const handleClose = (value) => {
    onClose(value);
  };

  const disableButton = () => {
    let ctdn = true;
    if (striker && nonStriker && striker.id && nonStriker.id) {
      ctdn = striker.id != nonStriker.id;
    } else {
      ctdn = striker && nonStriker && striker.name != nonStriker.name;
    }
    return !(striker && nonStriker && bowler && ctdn);
  };

  const errorMsg = () => {
    if (striker && nonStriker && striker.id && nonStriker.id) {
      return striker.id === nonStriker.id;
    } else {
      return striker && nonStriker && striker.name === nonStriker.name;
    }
  };

  return (
    <Dialog open={open}>
      {/* <DialogTitle>{title}</DialogTitle> */}

      <div className="new-inning-dialog-wrapper">
        {stopInnings && (
          <Alert severity="warning">
            {remainingOvers} overs remaining in this innings!
          </Alert>
        )}
        <div className="wicket-type">
          {/* <Typography variant="subtitle2" gutterBottom>
            Select Striker
          </Typography>
          <ToggleButtons
            id="batsmen"
            items={batsmenItems}
            value={null}
            handleSelection={(val) => setStriker(val)}
          /> */}
          {/* <AutocompleteDropdown
            id="batsmen-1-ac"
            dropdownOptions={batsmenItems}
            placeholder="Select Striker"
            handleChange={(val) => setStriker(val)}
          /> */}
          <AutoCompleteAsync
            id="batsmen-1-ac"
            teamId={battingTeam.id}
            placeholder="Select Striker"
            handleChange={(val) => setStriker(val)}
            excludedItems={players}
          />
        </div>
        <div className="wicket-type">
          {/* <Typography variant="subtitle2" gutterBottom>
            Select Non Striker
          </Typography>
          <ToggleButtons
            id="batsmen"
            items={batsmenItems}
            value={null}
            handleSelection={(val) => setNonStriker(val)}
          /> */}
          {/* <AutocompleteDropdown
            id="batsmen-2-ac"
            dropdownOptions={batsmenItems}
            placeholder="Select Non Striker"
            handleChange={(val) => setNonStriker(val)}
          /> */}
          <AutoCompleteAsync
            id="batsmen-2-ac"
            teamId={battingTeam.id}
            placeholder="Select Non Striker"
            handleChange={(val) => setNonStriker(val)}
            excludedItems={players}
          />
        </div>
        {errorMsg() && (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            Please select different Batsmen!
          </Alert>
        )}
        <div className="wicket-type">
          {/* <Typography variant="subtitle2" gutterBottom>
            Select Bowler
          </Typography>
          <ToggleButtons
            key="bowler"
            items={bowlerItems}
            value={null}
            handleSelection={(val) => setBowler(val)}
          /> */}
          {/* <AutocompleteDropdown
            id="bowler-1-ac"
            dropdownOptions={bowlerItems}
            placeholder="Select Bowler"
            handleChange={(val) => setBowler(val)}
          /> */}
          <AutoCompleteAsync
            id="bowler-1-ac"
            teamId={bowlingTeam.id}
            placeholder="Select Bowler"
            handleChange={(val) => setBowler(val)}
          />
        </div>
        {isFirstInnings && (
          <div className="wicket-type">
            <TextField
              id="standard-basic"
              label="Penalty Runs"
              type="number"
              variant="filled"
              value={penaltyRuns}
              size="small"
              onChange={(event) => {
                setPenaltyRuns(parseInt(event.target.value || 0, 10));
              }}
            />
          </div>
        )}
        <Button
          variant="contained"
          disabled={disableButton()}
          onClick={() =>
            onClose({
              striker,
              nonStriker,
              bowler,
              startLater: false,
              penaltyRuns,
            })
          }
          className="update-button"
        >
          Start Second Innings
        </Button>

        <Button
          variant="outlined"
          onClick={() => onClose({ startLater: true, penaltyRuns })}
          className="update-button"
        >
          Later
        </Button>
        <Button
          variant="outlined"
          onClick={() => onClose(null)}
          className="update-button"
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}

NewInningsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
};
