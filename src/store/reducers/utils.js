export const updateCurrentBowlerDetails = (
  innings,
  currentBowler,
  newBowler
) => {
  // update maiden
  const currBalls = innings.balls.filter((b) => b.over === innings.currentOver);

  const isMaiden =
    currBalls.length === 6 &&
    currBalls.filter((c) => c.runs === 0 || (c.runs && c.byes)).length === 6;

  console.log("isMaiden", isMaiden);
  const maidenCount = isMaiden ? 1 : 0;
  const updatedCurrentBowler = {
    ...currentBowler,
    overs: currentBowler.overs ? currentBowler.overs + 1 : 1,
    maidens: currentBowler.maidens
      ? currentBowler.maidens + maidenCount
      : maidenCount,
  };
  const bowlers = [...innings.bowlers];
  const bowlerExists = bowlers.findIndex(
    (bow) => bow.id === updatedCurrentBowler.id
  );
  // console.log("bowlers", bowlerExists);
  // update current bowler to bowlers
  if (bowlerExists >= 0) {
    bowlers.splice(bowlerExists, 1, updatedCurrentBowler);
  } else {
    bowlers.push(updatedCurrentBowler);
  }

  // update current bowler
  let updatedNewBowler = newBowler ? newBowler : updatedCurrentBowler;
  const bowlerAlreadyBowled = bowlers.findIndex(
    (bow) => bow.id === updatedNewBowler.id
  );
  if (bowlerAlreadyBowled >= 0) {
    updatedNewBowler = { ...bowlers[bowlerAlreadyBowled] };
  }
  return { updatedNewBowler, bowlers };
};
