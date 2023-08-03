import * as React from "react";
import PropTypes from "prop-types";

// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
// import Avatar from "@mui/material/Avatar";
// import AddIcon from "@mui/icons-material/Add";
// import Stack from "@mui/material/Stack";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import { Timestamp } from "firebase/firestore/lite";
// import { v4 as uuid } from "uuid";

import "./PlayerDialog.scss";
import { getNewPlayerDetails, omitProps } from "../../utils";
import AutocompleteDropdown from "../../../../components/autocomplete-dropdown/AutocompleteDropdown";
import AutoCompleteAsync from "../../../../components/autocomplete-async/AutoCompleteAsync";

export default function PlayerDialog(props) {
  const {
    onClose,
    team,
    open,
    title,
    // players,
    excludedPlayers = [],
  } = props;
  // console.log("players", players, team);
  // const [isCreate, setIsCreate] = React.useState(false);
  // const [playerName, setPlayerName] = React.useState("");

  const handleClose = (value) => {
    onClose({ isNew: false, value });
  };

  const createNewPlayer = (name) => {
    // setIsCreate(false);
    onClose({
      isNew: true,
      value: getNewPlayerDetails(name, team.id),
    });
    // setPlayerName("");
  };

  const handleChange = (val) => {
    console.log(val);
    if (val) {
      const value = omitProps("title", val);
      if (value.id) handleClose(value);
      else createNewPlayer(value.name);
    }
  };

  // const playerItems = players
  //   .filter((pl) => pl.id !== excludedPlayerId)
  //   .map((bow) => ({
  //     ...bow,
  //     title: bow.name,
  //   }));

  return (
    <Dialog onClose={() => handleClose(null)} open={open}>
      <DialogTitle sx={{ paddingLeft: "0px", paddingBottom: "0px" }}>
        {team?.name}
      </DialogTitle>

      <div className="player-dialog-wrapper">
        {/* <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 100,
              height: 40,
            },
          }}
        > */}
        {/* <div className="player-dialog-wrapper"> */}

        {/* {[...players]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((player, index) => {
              return currentBowler && currentBowler.id === player.id ? null : (
                <Paper
                  key={index}
                  elevation={3}
                  onClick={() => handleClose(player)}
                >
                  <div className="add-player">{player.name}</div>
                </Paper>
              );
            })}
          <Paper
            elevation={3}
            classes={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              verticalAlign: "middle",
              boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "25px",
            }}
            sx={{ width: "40px !important" }}
            onClick={() => setIsCreate(true)}
          >
            <div>
              <Avatar>
                <AddIcon />
              </Avatar>
            </div>
          </Paper> */}
        {/* <AutocompleteDropdown
          id="player-ac"
          dropdownOptions={playerItems}
          placeholder={title}
          handleChange={handleChange}
          width={250}
        /> */}

        <AutoCompleteAsync
          id="player-ac"
          teamId={team.id}
          placeholder={title}
          handleChange={handleChange}
          width={250}
          excludedItems={excludedPlayers}
        />
        {/* </div> */}
        {/* </Box> */}

        {/* {isCreate && (
          <Stack direction="column" spacing={2}>
            <TextField
              id="standard-basic"
              label="Player Name"
              variant="filled"
              value={playerName}
              required
              onChange={(event) => {
                setPlayerName(event.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={createNewPlayer}
              disabled={playerName.length === 0}
            >
              Add Player
            </Button>
          </Stack>
        )} */}
      </div>
    </Dialog>
  );
}

PlayerDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
};
