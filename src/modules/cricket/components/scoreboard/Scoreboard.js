import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";

import MainScore from "./main-score/MainScore";
import BatsmenCard from "./batsmen-card/BatsmenCard";
import CurrentOver from "./current-over/CurrentOver";
import BallActions from "./ball-actions/BallActions";
// import { db } from "../../../../database/firebase.db";
// import { setDoc, doc } from "firebase/firestore/lite";
import "./Scoreboard.scss";

export default function Scoreboard() {
  const {
    matchDetails,
    scoreboard,
    scoreboard: {
      isFirstInnings,
      firstInnings,
      secondInnings,
      isMatchStarted,
      isMatchCompleted,
    },
    scoreboardEntries,
  } = useSelector((state) => state.cricket);

  const navigate = useNavigate();
  const innings = isFirstInnings ? firstInnings : secondInnings;
  const { batsmen1, batsmen2 } = innings;

  React.useEffect(() => {
    if (!isMatchStarted) {
      navigate("/cricket");
    } else if (isMatchCompleted) {
      navigate("/cricket/finalscore");
    }
  }, []);

  // React.useEffect(() => {
  //   if (scoreboardEntries.length > 1 && (!isFirstInnings || isMatchCompleted)) {
  //     // update match in db
  //     console.log("match updated in DB");
  //     updateMatch(scoreboard, matchDetails);
  //   }
  // }, [isFirstInnings]);

  // function Prompt(props) {
  //   const block = props.when;

  //   useBlocker(() => {
  //     if (block) {
  //       return !window.confirm(props.message);
  //     }
  //     return false;
  //   });

  //   return <div key={block} />;
  // }

  return (
    <div className="scoreboard-wrapper">
      {/* <Prompt when={true} message="Are you sure you want to leave?" />; */}
      <Stack direction={"column"} spacing={2}>
        <MainScore />
        {(batsmen1 || batsmen2) && (
          <>
            <BatsmenCard />
            <CurrentOver />
            <BallActions />
          </>
        )}
      </Stack>
    </div>
  );
}

// const updateMatch = async (scoreboard, matchDetails) => {
//   try {
//     const client = JSON.parse(sessionStorage.getItem("client"));
//     const data = {
//       clientId: client ? client.clientId : 0,
//       matchId: scoreboard.matchId,
//       matchDetails,
//       scoreboard,
//     };
//     await setDoc(doc(db, "matches", scoreboard.matchId), data);
//   } catch (err) {
//     alert(err);
//   }
// };
