import { Timestamp } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";

export const omitProps = (key, obj) => {
  const { [key]: omitted, ...rest } = obj;
  return rest;
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
    created: Timestamp.now(),
    matches: 0,
    battingInnings: 0,
    bowlingInnings: 0,
    runs: 0,
    balls: 0,
    // average: 0, //
    highestScore: 0,
    highestScoreNotOut: false,
    fours: 0,
    sixes: 0,
    catches: 0,
    wickets: 0,
    bestBowlingWickets: 0,
    bestBowlingRuns: -1,
    // bowlingAverage: 0, //
    bowlingRuns: 0,
    bowlingBalls: 0,
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
    sixes: 0,
    wickets: 0,
    catches: 0,
    bowlingBalls: 0,
    bowlingRuns: 0,
    overs: 0,
    maidens: 0,
  };
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
