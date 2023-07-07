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
  isFirstInnings = false,
}) => {
  const lastBall = balls && balls.length > 0 ? balls[balls.length - 1] : null;
  let overValue = 0;
  let remainingOvers = overs;
  let remainingBalls = overs * 6;
  const runsRequired = totalRuns - totalRuns2 + 1;
  if (lastBall) {
    const { over, overBallNo } = lastBall;
    overValue = overBallNo === 6 ? over + 1 : `${over}.${overBallNo}`;

    // calculate remaining Overs
    const totalBallsReq = overs * 6;
    remainingBalls = totalBallsReq - (over * 6 + overBallNo);
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
