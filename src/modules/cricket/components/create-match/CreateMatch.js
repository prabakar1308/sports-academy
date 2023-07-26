import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore/lite";

import ModalDialog from "../../../../components/dialog/Dialog";
import MatchToss from "../match-toss/MatchToss";
import { db } from "../../../../database/firebase.db";
import * as cricketActions from "../../../../store/actions/cricket";
import { setPlayerForCurrentMatch } from "../../utils";

const CreateMatch = () => {
  const [open, setOpen] = React.useState(false);
  const [clearPlayers, setClearPlayers] = React.useState(false);
  const [isFirst, setIsFirst] = React.useState(false);
  const [firstTeam, setFirstTeam] = React.useState(null);
  const [secondTeam, setSecondTeam] = React.useState(null);
  const [toss, setToss] = React.useState(null);
  const [battingFirst, setBattingFirst] = React.useState(null);
  const [overs, setOvers] = React.useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, matchDetails } = useSelector((state) => state.cricket);

  React.useEffect(() => {
    // FB - get teams
    const client = JSON.parse(sessionStorage.getItem("client"));
    const q = query(
      collection(db, "teams"),
      where("clientId", "==", client ? client.clientId : 0),
      orderBy("created", "desc")
    );
    // const q = query(collection(db, "teams"), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      dispatch(cricketActions.getCricketTeams(data));
    });
  }, []);

  React.useEffect(() => {
    const { team1, team2, overs, toss, battingFirst } = matchDetails;
    setFirstTeam(team1);
    setSecondTeam(team2);
    setOvers(overs);
    setToss(toss);
    setBattingFirst(battingFirst);
  }, [matchDetails]);

  const handleClickOpen = (value) => {
    setIsFirst(value);
    setOpen(true);
  };

  const handleClose = ({ isNew, value }) => {
    // createTeam();
    console.log("{ isNew, value }", { isNew, value });
    if (value) {
      if (isNew) {
        createTeam(value);
        dispatch(cricketActions.addCricketTeam(value));
      } else if (value) {
        getPlayers(value, isFirst);
      }
      if (isFirst) {
        setFirstTeam(value);
        setToss(value);
      } else {
        setSecondTeam(value);
        setToss(firstTeam);
      }
    }
    setOpen(false);
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };
  const tossValueChange = (val) => {
    setToss(val);
    setClearPlayers(true);
  };
  const tossDecidedChange = (val) => {
    setBattingFirst(val);
    setClearPlayers(true);
  };

  const moveFurther = () => {
    dispatch(
      cricketActions.updateMatchDetails({
        team1: firstTeam,
        team2: secondTeam,
        overs,
        toss: toss || firstTeam,
        battingFirst: battingFirst || firstTeam,
      })
    );

    if (clearPlayers) {
      dispatch(
        cricketActions.updateMatchDetails({
          striker: null,
          nonStriker: null,
          openingBowler: null,
        })
      );
    }
    setClearPlayers(null);
    navigate("/cricket/settings");
  };

  // firebase

  const createTeam = async (team) => {
    try {
      // FB - create team
      await addDoc(collection(db, "teams"), team);
    } catch (err) {
      alert(err);
    }
  };

  const getPlayers = async (team, isFirst) => {
    // import { doc, where, getDocs } from "firebase/firestore";

    // const teamIdRef = doc(db, "teams", teamId);

    // const q = query(collection(db, "players"), where("teamId", "==", teamIdRef));

    // const files = await getDocs(q);
    // console.log("players", files);
    const key = isFirst ? "team1Players" : "team2Players";
    const teamKey = isFirst ? "team1" : "team2";
    const q = query(
      collection(db, "players"),
      where("teamId", "==", team.id),
      orderBy("created", "desc")
    );
    console.log("sdfsssssssssssssssssssssssssssssssssssssssss");
    onSnapshot(q, (querySnapshot) => {
      const value = querySnapshot.docs.map((doc) => doc.data());
      // dispatch(cricketActions.updateCricketFields({ key, value }));
      // const updatedPlayers = setPlayerForCurrentMatch(value);
      dispatch(
        cricketActions.updateMatchDetails({
          [key]: value,
          [teamKey]: team,
        })
      );
      // dispatch(cricketActions.updateCricketFields({ key, value }));
      // console.log("players", { key, value });
    });
  };

  return (
    <Stack
      spacing={4}
      direction="column"
      sx={{
        backgroundImage: "linear-gradient(#dee4a3, #bfd1d0)",
        padding: "25px 0",
        height: "calc(100vh - 170px)",
      }}
    >
      <Stack direction="row" spacing={1} justifyContent="center">
        <Chip
          onClick={() => handleClickOpen(true)}
          label={firstTeam ? firstTeam.name : "Select Team A"}
          // onDelete={handleDelete}
        />
        <Avatar sx={{ width: 30, height: 30 }}>vs</Avatar>
        <Chip
          onClick={() => handleClickOpen(false)}
          label={secondTeam ? secondTeam.name : "Select Team B"}
          // onDelete={handleDelete}
        />
      </Stack>
      {firstTeam && secondTeam && firstTeam.id === secondTeam.id && (
        <Stack direction="row" justifyContent="center">
          <Alert severity="error">Please select different teams!</Alert>
        </Stack>
      )}
      {firstTeam && secondTeam && firstTeam.id !== secondTeam.id && (
        <Stack
          justifyContent="center"
          direction={"column"}
          spacing={4}
          alignItems={"center"}
        >
          <MatchToss
            teamA={firstTeam}
            teamB={secondTeam}
            tossWonBy={toss}
            optedTo={battingFirst}
            tossValueChange={tossValueChange}
            tossDecidedChange={tossDecidedChange}
          />
          <TextField
            id="standard-basic"
            label="No. of Overs"
            variant="filled"
            required
            value={overs}
            onChange={(event) => {
              setOvers(parseInt(event.target.value || 0, 10));
            }}
          />

          {/* <Link to="/cricket/settings"> */}
          <Button variant="outlined" onClick={() => moveFurther()}>
            Move Further
          </Button>
          {/* </Link> */}
        </Stack>
      )}

      <ModalDialog
        selectedValue={isFirst ? firstTeam : secondTeam}
        open={open}
        onClose={handleClose}
        title={"Available Teams"}
        teams={teams}
      />
    </Stack>
  );
};

export default CreateMatch;
