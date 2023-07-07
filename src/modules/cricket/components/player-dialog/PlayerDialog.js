import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Timestamp } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";

import "./PlayerDialog.scss";

export default function PlayerDialog(props) {
  const { onClose, team, open, title, players, currentBowler = null } = props;
  // console.log("players", players, team);
  const [isCreate, setIsCreate] = React.useState(false);
  const [playerName, setPlayerName] = React.useState("");

  const handleClose = (value) => {
    onClose({ isNew: false, value });
  };

  const createNewPlayer = () => {
    setIsCreate(false);
    onClose({
      isNew: true,
      value: {
        id: uuid(),
        name: playerName,
        teamId: team.id,
        isActive: true,
        created: Timestamp.now(),
        matches: 0,
        runs: 0,
        balls: 0,
        average: 0,
        highestScore: 0,
        fours: 0,
        sixes: 0,
        catches: 0,
        wickets: 0,
        bestBowlingWickets: 0,
        bestBowlingRuns: 0,
        bowlingAverage: 0,
        bowlingRuns: 0,
        bowlingBalls: 0,
        strikeRate: 0,
        innings: 0,
        outs: 0,
        notOuts: 0,
        overs: 0,
        maidens: 0,
        econRate: 0,
      },
    });
    setPlayerName("");
  };

  return (
    <Dialog onClose={() => handleClose(null)} open={open}>
      <DialogTitle>{title}</DialogTitle>

      <div className="player-dialog-wrapper">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 100,
              height: 40,
            },
          }}
        >
          {/* <div className="player-dialog-wrapper"> */}
          {players.map((player, index) => {
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
          </Paper>
          {/* </div> */}
        </Box>

        {isCreate && (
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
        )}
      </div>
    </Dialog>
  );
}

PlayerDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  team: PropTypes.object,
};
