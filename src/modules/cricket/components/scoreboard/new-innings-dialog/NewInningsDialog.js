import * as React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import "./NewInningsDialog.scss";
import ToggleButtons from "../../../../../components/toggleButton/ToggleButton";

export default function NewInningsDialog(props) {
  const {
    onClose,
    open,
    players = [],
    bowlers = [],
    remainingOvers,
    stopInnings = false,
  } = props;
  const bowlerItems = bowlers.map((bow) => ({ ...bow, value: bow.name }));
  const batsmenItems = players.map((bat) => ({ ...bat, value: bat.name }));

  const [striker, setStriker] = React.useState(null);
  const [nonStriker, setNonStriker] = React.useState(null);
  const [bowler, setBowler] = React.useState(null);

  const handleClose = (value) => {
    onClose(value);
  };

  const disableButton = () => {
    return !(striker && nonStriker && bowler && striker.id !== nonStriker.id);
  };

  return (
    <Dialog onClose={() => handleClose(null)} open={open}>
      {/* <DialogTitle>{title}</DialogTitle> */}

      <div className="player-dialog-wrapper">
        {stopInnings && (
          <Alert severity="warning">
            {remainingOvers} overs remaining in this innings!
          </Alert>
        )}
        <div className="wicket-type">
          <Typography variant="subtitle2" gutterBottom>
            Select Striker
          </Typography>
          <ToggleButtons
            id="batsmen"
            items={batsmenItems}
            value={null}
            handleSelection={(val) => setStriker(val)}
          />
        </div>
        <div className="wicket-type">
          <Typography variant="subtitle2" gutterBottom>
            Select Non Striker
          </Typography>
          <ToggleButtons
            id="batsmen"
            items={batsmenItems}
            value={null}
            handleSelection={(val) => setNonStriker(val)}
          />
        </div>
        {striker && nonStriker && striker.id === nonStriker.id && (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            Please select different Batsmen!
          </Alert>
        )}
        <div className="wicket-type">
          <Typography variant="subtitle2" gutterBottom>
            Select Bowler
          </Typography>
          <ToggleButtons
            key="bowler"
            items={bowlerItems}
            value={null}
            handleSelection={(val) => setBowler(val)}
          />
        </div>

        <Button
          variant="contained"
          disabled={disableButton()}
          onClick={() =>
            onClose({ striker, nonStriker, bowler, startLater: false })
          }
          className="update-button"
        >
          Start Second Innings
        </Button>

        <Button
          variant="outlined"
          onClick={() => onClose({ startLater: true })}
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
