// import { Timestamp } from "firebase/firestore/lite";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { v4 as uuid } from "uuid";
import { isMobile } from "react-device-detect";

export const omitProps = (key, obj) => {
  const { [key]: omitted, ...rest } = obj;
  return rest;
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getBattingOrder = (strikerId, nonStrikerId, playerId) => {
  if (strikerId === playerId) return 1;
  else if (nonStrikerId === playerId) return 2;
  return 99;
};

export const getRequiredRunDetails = ({
  balls,
  overs,
  totalRuns,
  totalRuns2,
  wickets,
  bowlingBalls,
}) => {
  const lastBall = balls && balls.length > 0 ? balls[balls.length - 1] : null;
  let overValue = 0;
  let remainingOvers = overs;
  let remainingBalls = overs * 6;
  const runsRequired = totalRuns - totalRuns2 + 1;
  if (lastBall) {
    const { over, overBallNo } = lastBall;
    // WORKAROUND - to fix first ball wide or no ball
    const updatedOverBallNo =
      overBallNo === 1 && bowlingBalls % 6 === 0 ? 0 : overBallNo;
    overValue = overBallNo === 6 ? over + 1 : `${over}.${updatedOverBallNo}`;

    // calculate remaining Overs
    const totalBallsReq = overs * 6;
    remainingBalls = totalBallsReq - (over * 6 + updatedOverBallNo);
    const roCalc1 = parseInt(remainingBalls / 6, 10);
    const roCalc2 = remainingBalls % 6;
    remainingOvers =
      roCalc1 === 0 && roCalc2 === 0 ? 0 : `${roCalc1}.${roCalc2}`;
  }
  const score = `${totalRuns}-${wickets} (${overValue} overs)`;

  const rrr =
    runsRequired && remainingBalls ? (runsRequired / remainingBalls) * 6 : 0;

  return { runsRequired, rrr, remainingBalls, remainingOvers, score };
};

export const getNewPlayerDetails = (name, teamId) => {
  return {
    id: uuid(),
    name,
    teamId,
    isActive: true,
    created: Date.parse(new Date()) / 1000,
    matches: 0,
    battingInnings: 0,
    bowlingInnings: 0,
    runs: 0,
    balls: 0,
    // average: 0, //
    highestScore: 0,
    highestScoreNotOut: false,
    fours: 0,
    dotBalls: 0,
    sixes: 0,
    catches: 0,
    wickets: 0,
    bestBowlingWickets: 0,
    bestBowlingRuns: -1,
    // bowlingAverage: 0, //
    bowlingRuns: 0,
    bowlingBalls: 0,
    bowlingDotBalls: 0,
    // strikeRate: 0, //
    // innings: 0,
    outs: 0,
    notOuts: 0,
    overs: 0,
    maidens: 0,
    // econRate: 0, //
  };
};

export const setPlayerForCurrentMatch = (player) => {
  return {
    ...player,
    runs: 0,
    balls: 0,
    fours: 0,
    dotBalls: 0,
    sixes: 0,
    wickets: 0,
    catches: 0,
    bowlingBalls: 0,
    bowlingDotBalls: 0,
    bowlingRuns: 0,
    overs: 0,
    maidens: 0,
  };
};

export const getBallDetails = ({
  runs,
  wicket,
  runout,
  wide,
  noBall,
  byes,
}) => {
  let value = runs;
  let color = "warning";
  if (wide) value = "WD";
  else if (noBall) value = "NB";
  else if (byes) {
    value = "B";
    color = "secondary";
  }
  return runout || wide || noBall || byes ? value : "";
};

const currentValue = ({ runs, wicket, runout, wide, noBall }) => {
  let value = runs;
  if (wicket || runout) value = "W";
  // else if (wide) value = "WD";
  // else if (noBall) value = "NB"
  return value;
};

export const getOverBalls = (curBalls) => {
  return (
    <Stack direction="row" spacing={isMobile ? 0 : 2}>
      {curBalls &&
        curBalls.map((det, index) => {
          const { wicket, runout, runs, wide, noBall } = det;
          const isWicket = det?.wicket;
          return (
            <div key={index}>
              <Avatar
                sx={{
                  width: isMobile ? 25 : 30,
                  height: isMobile ? 25 : 30,
                  fontSize: isMobile ? 8 : 12,
                  color: "black",
                  bgcolor: () => {
                    if (wicket || runout) return "lightcoral";
                    else if (runs && (runs === 4 || runs === 6))
                      return "lightgreen";
                    else if (wide || noBall) return "#ecdfb3";
                    else if (runs === 0) return "#ececec";
                    else return "#dcf4ed";
                  },
                  border: "2px solid lightgray",
                }}
              >
                {currentValue(det)}
                {getBallDetails(det)}
              </Avatar>
              {/* {getBallDetails(det)} */}
            </div>
          );
        })}
    </Stack>
  );
};

// export const createPlayer = async (player) => {
//   try {
//     await addDoc(collection(db, "players"), player);
//   } catch (err) {
//     alert(err);
//   }
// };

// export const getPlayerDetails = (player, team, inningsKey) => {
//   const updatedPlayer = player ? omitProps("title", player) : null;
//   if (updatedPlayer) {
//     if (updatedPlayer.id) return updatedPlayer;
//     else {
//       const newPlayer = getNewPlayerDetails(updatedPlayer.name, team.id);
//       createPlayer(newPlayer);
//       dispatch(
//         cricketActions.addCricketPlayer({
//           key: inningsKey,
//           value: newPlayer,
//         })
//       );
//       return newPlayer;
//     }
//   }
//   return updatedPlayer;
// };
