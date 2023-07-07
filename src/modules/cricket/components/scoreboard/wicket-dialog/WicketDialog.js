import * as React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import ToggleButtons from "../../../../../components/toggleButton/ToggleButton";
import { WICKET_TYPES } from "../../../constants";
import "./WicketDialog.scss";

export default function WicketDialog(props) {
  const {
    onClose,
    open,
    players,
    bowlers = [],
    wicket = "",
    isBatsmenRetire,
    hideNewBatsmen,
  } = props;

  const wicketTypes =
    wicket === WICKET_TYPES.RUNOUT
      ? [
          { id: 3, value: WICKET_TYPES.RUNOUT, disabled: false },
          { id: 4, value: WICKET_TYPES.RUNOUT_OTHER, disabled: false },
        ]
      : [
          { id: 1, value: WICKET_TYPES.BOWLED, disabled: false },
          { id: 2, value: WICKET_TYPES.CAUGHT, disabled: false },
        ];
  const selectedWicket = wicketTypes.filter((wt) => wt.value === wicket);
  // console.log("hideNewBatsmen", hideNewBatsmen);
  const bowlerItems = bowlers.map((bow) => ({ ...bow, value: bow.name }));
  const batsmenItems = players.map((bat) => ({ ...bat, value: bat.name }));
  const [wicketType, setWicketType] = React.useState(
    selectedWicket.length > 0 ? selectedWicket[0] : null
  );
  const [batsmen, setBatsmen] = React.useState(null);
  const [wicketHelpedBy, setWicketHelpedBy] = React.useState(null);

  const handleClose = (value) => {
    onClose({ isNew: false, value });
  };

  // const handleSelection = (value, stateObj) => {
  //   console.log("handle sel", value);
  //   stateObj(value);
  // };

  const disableButton = () => {
    // console.log("isBatsmenRetire", isBatsmenRetire);
    if (isBatsmenRetire) return !batsmen;
    if (hideNewBatsmen) return !wicketHelpedBy && !batsmen;
    return !(wicketType && wicketHelpedBy && batsmen);
  };

  return (
    <Dialog onClose={() => handleClose(null)} open={open}>
      {/* <DialogTitle>{title}</DialogTitle> */}

      <div className="player-dialog-wrapper">
        {!hideNewBatsmen && (
          <div className="wicket-type">
            <Typography variant="subtitle2" gutterBottom>
              New Batsmen
            </Typography>
            <ToggleButtons
              id="batsmen"
              items={batsmenItems}
              value={null}
              handleSelection={(val) => setBatsmen(val)}
            />
          </div>
        )}
        {!isBatsmenRetire && (
          <div className="wicket-type">
            <Typography variant="subtitle2" gutterBottom>
              Wicket Type
            </Typography>
            <ToggleButtons
              key="wicketType"
              items={wicketTypes}
              value={wicketType}
              handleSelection={(val) => setWicketType(val)}
            />
            <Typography variant="subtitle2" gutterBottom>
              Wicket Helped By
            </Typography>
            <ToggleButtons
              key="bowler"
              items={bowlerItems}
              value={null}
              handleSelection={(val) => setWicketHelpedBy(val)}
            />
          </div>
        )}

        <Button
          variant="contained"
          disabled={disableButton()}
          onClick={() => onClose({ wicketType, wicketHelpedBy, batsmen })}
          className="update-button"
        >
          Update
        </Button>
      </div>
    </Dialog>
  );
}

WicketDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
};
