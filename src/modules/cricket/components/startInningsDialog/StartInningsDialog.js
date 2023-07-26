import * as React from "react";
import PropTypes from "prop-types";

// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemAvatar from "@mui/material/ListItemAvatar";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemText from "@mui/material/ListItemText";
// import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
// import { v4 as uuid } from "uuid";

// import Avatar from "@mui/material/Avatar";
// import PersonIcon from "@mui/icons-material/Person";
// import AddIcon from "@mui/icons-material/Add";
// import { blue } from "@mui/material/colors";
import Typography from "@mui/material/Typography";

// import { Timestamp } from "firebase/firestore/lite";

// import Stack from "@mui/material/Stack";
// import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import "./StartInningsDialog.scss";
import ToggleButtons from "../../../../components/toggleButton/ToggleButton";

export default function StartInningsDialog(props) {
  const { onClose, team, open, title, players, bowlers = [] } = props;

  const bowlerItems = bowlers.map((bow) => ({ ...bow, value: bow.name }));
  const batsmenItems = players.map((bat) => ({ ...bat, value: bat.name }));
  const [striker, setStriker] = React.useState(null);
  const [nonStriker, setNonStriker] = React.useState(null);
  const [bowler, setBowler] = React.useState(null);

  React.useEffect(() => {
    return () => {
      // console.log("cleanuped");
    };
  }, []);

  const handleClose = (value) => {
    onClose({ isNew: false, value });
  };

  // const handleSelection = (value, stateObj) => {
  //   console.log("handle sel", value);
  //   stateObj(value);
  // };

  const disableButton = () => {
    return !(striker && nonStriker && bowler);
  };

  return (
    <Dialog onClose={() => handleClose(null)} open={open}>
      {/* <DialogTitle>{title}</DialogTitle> */}

      <div className="player-dialog-wrapper">
        <div className="wicket-type">
          <Typography variant="subtitle2" gutterBottom>
            Striker
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
            Non Striker
          </Typography>
          <ToggleButtons
            id="batsmen"
            items={batsmenItems}
            value={null}
            handleSelection={(val) => setNonStriker(val)}
          />
        </div>
        <div className="wicket-type">
          <Typography variant="subtitle2" gutterBottom>
            Opening Bowler
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
          onClick={() => onClose({ striker, nonStriker, bowler })}
          className="update-button"
        >
          Update
        </Button>
      </div>
    </Dialog>
  );
}

StartInningsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
};
