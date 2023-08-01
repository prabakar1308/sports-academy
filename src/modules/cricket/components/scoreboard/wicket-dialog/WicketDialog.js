import * as React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import ToggleButtons from "../../../../../components/toggleButton/ToggleButton";
import { WICKET_TYPES } from "../../../constants";
import "./WicketDialog.scss";
import AutocompleteDropdown from "../../../../../components/autocomplete-dropdown/AutocompleteDropdown";

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
  const bowlerItems = bowlers.map((bow) => ({ ...bow, title: bow.name }));
  const batsmenItems = players.map((bat) => ({ ...bat, title: bat.name }));
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
    if (wicketType.value === WICKET_TYPES.BOWLED)
      return !(wicketType && batsmen);
    return !(wicketType && wicketHelpedBy && batsmen);
  };

  return (
    <Dialog onClose={() => handleClose(null)} open={open}>
      {/* <DialogTitle>{title}</DialogTitle> */}

      <div className="player-dialog-wrapper">
        {!isBatsmenRetire && (
          <div className="wicket-type">
            <Typography variant="subtitle2" gutterBottom>
              Wicket Type
            </Typography>
            <ToggleButtons
              key="wicketType"
              items={wicketTypes}
              value={wicketType}
              handleSelection={(val) => {
                setWicketType(val);
                setWicketHelpedBy(null);
              }}
            />
            {/* <Typography variant="subtitle2" gutterBottom>
              Wicket Helped By
            </Typography>
            <ToggleButtons
              key="bowler"
              items={bowlerItems}
              value={null}
              handleSelection={(val) => setWicketHelpedBy(val)}
            /> */}

            {wicketType.value !== WICKET_TYPES.BOWLED && (
              <AutocompleteDropdown
                id="bowler-ac"
                dropdownOptions={bowlerItems}
                placeholder="Wicket Helped By"
                handleChange={(val) => setWicketHelpedBy(val)}
              />
            )}
            {/* <Autocomplete
              id="bowler-ac"
              options={bowlerItems}
              onChange={(event, value) => setBatsmen(value)}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="New Batsmen" />
              )}
            /> */}

            {/* <Autocomplete
              id="bowler-ac"
              options={bowlerItems}
              freesolo
              onChange={(event, value) => setWicketHelpedBy(value)}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Wicket Helped By" />
              )}
              filterOptions={(options) => {
                const result = [...options];
                result.push(
                  <Button
                    variant="outlined"
                    color="primary"
                    onMouseDown={() => console.log("New")}
                  >
                    + Add New
                  </Button> // typecasting required for typescript
                );

                return result;
              }}
            /> */}
          </div>
        )}
        {!hideNewBatsmen && (
          <div className="wicket-type">
            {/* <Typography variant="h6" gutterBottom>
              New Batsmen
            </Typography> */}
            <AutocompleteDropdown
              id="batsmen-ac"
              dropdownOptions={batsmenItems}
              placeholder="New Batsmen"
              handleChange={(val) => setBatsmen(val)}
            />
            {/* <ToggleButtons
              id="batsmen"
              items={batsmenItems}
              value={null}
              handleSelection={(val) => setBatsmen(val)}
            /> */}
          </div>
        )}
        <Button
          sx={{ width: "90%" }}
          variant="outlined"
          onClick={() => onClose(null)}
          className="update-button"
        >
          Cancel
        </Button>
        <Button
          sx={{ width: "90%" }}
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
