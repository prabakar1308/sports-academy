import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { v4 as uuid } from "uuid";
// import { Timestamp } from "firebase/firestore/lite";

// import { db } from "../../../../database/firebase.db";
import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore/lite";
import * as cricketActions from "../../../../store/actions/cricket";
import PlayerDialog from "../player-dialog/PlayerDialog";
import { getBattingOrder, setPlayerForCurrentMatch } from "../../utils";

import "./AdvancedSettings.scss";

const AdvancedSettings = () => {
  const [open, setOpen] = React.useState(false);
  const [playersCount, setPlayersCount] = React.useState(11);
  const [playerType, setPlayerType] = React.useState("");
  const [striker, setStriker] = React.useState(null);
  const [nonStriker, setNonStriker] = React.useState(null);
  const [bowler, setBowler] = React.useState(null);
  const [wide, setWide] = React.useState(true);
  const [noBall, setNoBall] = React.useState(true);
  const [byes, setByes] = React.useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    // team1Players,
    // team2Players,
    matchDetails,
    scoreboard,
    matchDetails: { team1, team2, team1Players, team2Players, battingFirst },
    scoreboard: { isMatchStarted },
  } = useSelector((state) => state.cricket);

  React.useEffect(() => {
    if (isMatchStarted) navigate("/cricket/scoreboard");
  }, [isMatchStarted]);

  React.useEffect(() => {
    const {
      striker,
      nonStriker,
      openingBowler,
      wideAllowed,
      noBallAllowed,
      byesAllowed,
      playersPerTeam,
    } = matchDetails;

    setStriker(striker);
    setNonStriker(nonStriker);
    setBowler(openingBowler);
    setWide(wideAllowed);
    setNoBall(noBallAllowed);
    setByes(byesAllowed);
    setPlayersCount(playersPerTeam);
  }, [matchDetails]);

  const handleClickOpen = (value) => {
    setPlayerType(value);
    setOpen(true);
  };

  const handleClose = ({ isNew, value }) => {
    if (isNew) {
      // createPlayer(value);
      const values = {
        striker,
        nonStriker,
        openingBowler: bowler,
        wideAllowed: wide,
        noBallAllowed: noBall,
        byesAllowed: byes,
        playersPerTeam: playersCount,
      };
      const players =
        playerType === "openingBowler" ? [...team2Players] : [...team1Players];
      const teamPlayerKey =
        playerType === "openingBowler" ? "team2Players" : "team1Players";

      // dispatch(
      //   cricketActions.updateMatchDetails({
      //     ...values,
      //     [playerType]: value,
      //     [teamPlayerKey]: [...players, value],
      //   })
      // );

      dispatch(
        cricketActions.createPlayerBeforeStart({
          apiData: value,
          actionData: {
            ...values,
            [playerType]: value,
            [teamPlayerKey]: [...players, value],
          },
        })
      );
      // dispatch(
      //   cricketActions.addCricketPlayer({
      //     key: playerType === "openingBowler" ? "team2Players" : "team1Players",
      //     value,
      //   })
      // );
    } else if (value) {
      if (playerType === "striker") {
        setStriker(value);
      } else if (playerType === "nonStriker") {
        setNonStriker(value);
      } else if (playerType === "openingBowler") {
        setBowler(value);
      }
    }
    setOpen(false);
    setPlayerType("");
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const handleWideChange = (event) => {
    setWide(event.target.checked);
  };
  const handleNoBallChange = (event) => {
    setNoBall(event.target.checked);
  };
  const handleByesChange = (event) => {
    setByes(event.target.checked);
  };

  const navigateAction = (path, updatePlayers) => {
    dispatch(
      cricketActions.updateMatchDetails({
        striker,
        nonStriker,
        openingBowler: bowler,
        wideAllowed: wide,
        noBallAllowed: noBall,
        byesAllowed: byes,
        playersPerTeam: playersCount,
      })
    );
    if (updatePlayers) {
      const players1 = isFirstTeam() ? team1Players : team2Players;
      const players2 = isFirstTeam() ? team2Players : team1Players;
      const fields = {
        matchId: uuid(),
        isMatchStarted: true,
        firstInnings: {
          team: isFirstTeam() ? team1 : team2,
          players: players1.map((player) => ({
            // update to maintain only current match data
            ...setPlayerForCurrentMatch(player),
            // [INFO]: isOut: null --> yet to bat & isOut: false ---> current batsmens
            isOut:
              striker.id === player.id || nonStriker.id === player.id
                ? false
                : null,
            isRetire: false,
            battingOrder: getBattingOrder(striker.id, nonStriker.id, player.id),
          })),
          batsmen1: { ...setPlayerForCurrentMatch(striker), isStriker: true },
          batsmen2: {
            ...setPlayerForCurrentMatch(nonStriker),
            isStriker: false,
          },
          currentBowler: setPlayerForCurrentMatch(bowler),
          currentOver: 0,
          bowlers: [],
          balls: [],
          overs: {
            ballNum: 1,
            overNum: 0,
            overBallNum: 1,
          },
          totalRuns: 0,
          totalBalls: 0,
          wickets: 0,
          extras: 0,
        },
        secondInnings: {
          team: isFirstTeam() ? team2 : team1,
          players: players2.map((player) => ({
            // update to maintain only current match data
            ...setPlayerForCurrentMatch(player),
            isOut: null,
            isRetire: false,
          })),
          batsmen1: null,
          batsmen2: null,
          currentBowler: null,
          currentOver: 0,
          bowlers: [],
          balls: [],
          overs: {
            ballNum: 1,
            overNum: 0,
            overBallNum: 1,
          },
          totalRuns: 0,
          totalBalls: 0,
          wickets: 0,
          extras: 0,
        },
      };
      // dispatch(cricketActions.updateScoreboardFields(fields));
      // createMatch(scoreboard, matchDetails, fields);
      dispatch(
        cricketActions.saveCricketMatch({
          scoreboard,
          matchDetails,
          fields,
        })
      );
    } else navigate(path);
  };

  const isFirstTeam = () => {
    if (playerType === "openingBowler") {
      return battingFirst && battingFirst.id === team2.id;
    }
    return battingFirst && battingFirst.id === team1.id;
  };

  const marks = [
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 10 },
    { value: 11, label: 11 },
    { value: 12, label: 12 },
    { value: 13, label: 13 },
    { value: 14, label: 14 },
    { value: 15, label: 15 },
  ];

  return (
    <div className="cricket-adv-settings">
      <Stack
        spacing={4}
        direction="column"
        justifyContent="center"
        sx={{
          backgroundImage: "linear-gradient(#dee4a3, #bfd1d0)",
          padding: "25px 0",
          height: "calc(100vh - 170px)",
        }}
      >
        <Stack
          direction="column"
          spacing={1}
          justifyContent="center"
          alignItems={"center"}
        >
          <Typography variant="subtitle2" gutterBottom>
            No. of Players
          </Typography>
          <Slider
            track=""
            aria-labelledby="track-inverted-slider"
            // getAriaValueText={p}
            color="secondary"
            size="small"
            // valueLabelDisplay="on"
            min={8}
            max={15}
            step={1}
            marks={marks}
            value={playersCount}
            onChange={(event) => setPlayersCount(event.target.value)}
          />
          {/* <div> */}
          <Typography variant="subtitle2" gutterBottom>
            Striker
          </Typography>
          <Chip
            onClick={() => handleClickOpen("striker")}
            label={striker ? striker.name : "Select Striker"}
            // onDelete={handleDelete}
          />
          <Typography variant="subtitle2" gutterBottom>
            Non-Striker
          </Typography>
          <Chip
            onClick={() => handleClickOpen("nonStriker")}
            label={nonStriker ? nonStriker.name : "Select Non Striker"}
          />
          {/* </div> */}

          {striker && nonStriker && striker.id === nonStriker.id && (
            <Stack direction="row" justifyContent="center">
              <Alert severity="error">Please select different players!</Alert>
            </Stack>
          )}
          <Typography variant="subtitle2" gutterBottom>
            Opening Bowler
          </Typography>
          <Chip
            onClick={() => handleClickOpen("openingBowler")}
            label={bowler ? bowler.name : "Select Bowler"}
            // onDelete={handleDelete}
          />
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={wide}
                  onChange={handleWideChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Wide"
            />
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={noBall}
                  onChange={handleNoBallChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="No Ball"
            />
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={byes}
                  onChange={handleByesChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Byes"
            />
          </FormGroup>
          {/* <Link to="/cricket/scoreboard"> */}
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigateAction("/cricket/new-match", false)}
            >
              Move Back
            </Button>
            <Button
              color="secondary"
              variant="contained"
              disabled={
                (striker && nonStriker && striker.id === nonStriker.id) ||
                !striker ||
                !nonStriker ||
                !bowler
              }
              onClick={() => navigateAction("/cricket/scoreboard", true)}
            >
              Start Match
            </Button>
          </Stack>
          {/* </Link> */}
        </Stack>

        {open && (
          <PlayerDialog
            team={isFirstTeam() ? team1 : team2}
            open={open}
            onClose={handleClose}
            title={"Available Players"}
            // players={isFirstTeam() ? team1Players : team2Players}
          />
        )}
      </Stack>
    </div>
  );
};

// const createPlayer = async (player) => {
//   try {
//     await setDoc(doc(db, "players", player.id), player);
//   } catch (err) {
//     alert(err);
//   }
// };

// const createMatch = async (scoreboard, matchDetails, fields) => {
//   try {
//     const client = JSON.parse(sessionStorage.getItem("client"));
//     const data = {
//       clientId: client ? client.clientId : 0,
//       matchId: fields.matchId,
//       matchDetails,
//       scoreboard: {
//         ...scoreboard,
//         ...fields,
//       },
//       created: Timestamp.now(),
//     };
//     await setDoc(doc(db, "matches", fields.matchId), data);
//   } catch (err) {
//     alert(err);
//   }
// };

export default AdvancedSettings;
