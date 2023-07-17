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

// runs: 0,
// balls: 0,
// fours: 0,
// sixes: 0,
// wickets: 0,
// catches: 0,
// bowlingBalls: 0,
// bowlingRuns: 0,
// overs: 0,
// maidens: 0,

// const removeProps = [
//   "wicketHelpedBy",
//   "wicketType",
//   "bowler",
//   "isOut",
//   "isRetire",
//   "strikerRate",
//   "econRate",
// ];

export const getMaidenCount = (innings) => {
  const currBalls = innings.balls.filter((b) => b.over === innings.currentOver);

  const isMaiden =
    currBalls.length === 6 &&
    currBalls.filter((c) => c.runs === 0 || (c.runs && c.byes)).length === 6;

  return isMaiden ? 1 : 0;
};

export const getOverCount = (innings) => {
  return innings.balls.filter((b) => b.over === innings.currentOver).length ===
    6
    ? 1
    : 0;
};

const removeProps = (obj) => {
  const {
    wicketHelpedBy,
    wicketType,
    bowler,
    isOut,
    isRetire,
    isStriker,
    strikeRate,
    econRate,
    ...restProps
  } = obj;
  return restProps;
};

const updateBowler = (mainPlayers, bowlers, batsmens) => {
  let updatedPlayers = [...batsmens];
  [...bowlers].map((player) => {
    const filteredPlayer = mainPlayers.filter((bow) => bow.id === player.id);
    let newDetails = {};
    if (filteredPlayer && filteredPlayer.length > 0) {
      const {
        wickets,
        catches,
        bowlingRuns,
        bowlingBalls,
        overs,
        maidens,
        bestBowlingWickets,
        bestBowlingRuns,
        matches,
      } = filteredPlayer[0];

      const moreWickets = bestBowlingWickets <= player.wickets;

      newDetails = {
        wickets: player.wickets + wickets,
        matches: matches + 1,
        catches: player.catches + catches,
        bowlingRuns: player.bowlingRuns + bowlingRuns,
        bowlingBalls: player.bowlingBalls + bowlingBalls,
        overs: player.overs + overs,
        maidens: player.maidens + maidens,
        bestBowlingWickets: moreWickets ? player.wickets : bestBowlingWickets,
        bestBowlingRuns:
          moreWickets &&
          (player.bowlingRuns <= bestBowlingRuns || bestBowlingRuns === -1) &&
          player.bowlingRuns >= 0
            ? player.bowlingRuns
            : bestBowlingRuns,
        bowlingInnings: player.bowlingInnings + 1,
      };
    } else {
      newDetails = {
        matches: 1,
        bestBowlingWickets: player.wickets,
        bestBowlingRuns: player.bowlingRuns,
        bowlingInnings: player.bowlingInnings + 1,
      };
    }

    // removeProps.forEach((prop) => delete player[prop]);

    let playerDetails = {
      ...removeProps(player),
      ...newDetails,
    };
    const index = updatedPlayers.findIndex((bat) => bat.id === player.id);
    if (index >= 0) {
      playerDetails = {
        ...updatedPlayers[index],
        ...newDetails,
      };
      updatedPlayers.splice(index, 1, playerDetails);
    } else {
      updatedPlayers.push(playerDetails);
    }
  });
  return updatedPlayers;
};

const updateBatsmen = (mainPlayers, batsmens) => {
  return [...batsmens].map((player) => {
    const filteredPlayer = mainPlayers.filter((bat) => bat.id === player.id);
    let newDetails = {};
    if (filteredPlayer && filteredPlayer.length > 0) {
      const {
        matches,
        runs,
        balls,
        fours,
        sixes,
        highestScore,
        highestScoreNotOut,
      } = filteredPlayer[0];
      newDetails = {
        matches: matches + 1,
        runs: player.runs + runs,
        balls: player.balls + balls,
        fours: player.fours + fours,
        sixes: player.sixes + sixes,
        highestScore: highestScore > player.runs ? highestScore : player.runs,
        highestScoreNotOut:
          player.runs >= highestScore
            ? player.isOut === false
            : highestScoreNotOut,
        outs: player.isOut ? player.outs + 1 : player.outs,
        notOuts: player.isOut === false ? player.notOuts + 1 : player.notOuts,
        battingInnings:
          player.isOut || player.isOut === false
            ? player.battingInnings + 1
            : player.battingInnings,
      };
    } else {
      newDetails = {
        matches: 1,
        highestScore: player.runs,
        outs: player.isOut ? 1 : 0,
        notOuts: player.isOut === false ? 1 : 0,
        highestScoreNotOut: player.isOut === false,
        battingInnings: player.isOut || player.isOut === false ? 1 : 0,
      };
    }

    // removeProps.forEach((prop) => delete player[prop]);
    return {
      ...removeProps(player),
      ...newDetails,
    };
  });
};

export const updateTeamPlayerScore = (scoreboard, matchDetails) => {
  const { team1, team2, battingFirst, team1Players, team2Players } =
    matchDetails;
  const { firstInnings, secondInnings } = scoreboard;

  let players1 = [...team2Players];
  let players2 = [...team2Players];
  let players1Key = "team2Players";
  let players2Key = "team2Players";

  if (team1 && battingFirst && team1.id === battingFirst.id) {
    players1 = [...team1Players];
    players1Key = "team1Players";
  }

  if (team2 && battingFirst && team2.id === battingFirst.id) {
    players2 = [...team1Players];
    players2Key = "team1Players";
  }

  console.log("dssddsds");
  // if (team1 && battingFirst && team1.id === battingFirst.id) {
  const batsmens1 = updateBatsmen(players1, firstInnings.players);
  players1 = updateBowler(players1, secondInnings.bowlers, batsmens1);
  // }
  // if (team2 && battingFirst && team2.id !== battingFirst.id) {
  const batsmens2 = updateBatsmen(players2, secondInnings.players);
  players2 = updateBowler(players2, firstInnings.bowlers, batsmens2);
  // }
  return { [players1Key]: players1, [players2Key]: players2 };
};

// export const updateTeamPlayerScore = (scoreboard, matchDetails) => {
//   const { team1, battingFirst, team1Players, team2Players } = matchDetails;
//   const { firstInnings, secondInnings } = scoreboard;

//   let players1 = [...team1Players];
//   let players2 = [...team2Players];
//   console.log("dssddsds");
//   if (team1 && battingFirst && team1.id === battingFirst.id) {
//     const batsmens = updateBatsmen(team1Players, firstInnings.players);
//     players1 = updateBowler(batsmens, secondInnings.bowlers);
//   } else {
//     const batsmens = updateBatsmen(team2Players, secondInnings.players);
//     players2 = updateBowler(batsmens, firstInnings.bowlers);
//   }
//   return { players1, players2 };
// };

// const updateBowler = (mainPlayers, bowlers) => {
//   return mainPlayers.map((player) => {
//     const filteredPlayer = bowlers.filter((bow) => bow.id === player.id);
//     if (filteredPlayer && filteredPlayer.length > 0) {
//       const { wickets, catches, bowlingRuns, bowlingBalls, overs, maidens } =
//         filteredPlayer[0];

//       return {
//         ...player,
//         wickets: player.wickets + wickets,
//         catches: player.catches + catches,
//         bowlingRuns: player.bowlingRuns + bowlingRuns,
//         bowlingBalls: player.bowlingBalls + bowlingBalls,
//         overs: player.overs + overs,
//         maidens: player.maidens + maidens,
//         bestBowlingWickets:
//           player.bestBowlingWickets >= wickets
//             ? player.bestBowlingWickets
//             : wickets,
//         bestBowlingRuns:
//           player.bestBowlingRuns <= bowlingRuns
//             ? player.bestBowlingRuns
//             : bowlingRuns,
//         bowlingInnings: player.bowlingInnings + 1,
//       };
//     }
//     return player;
//   });
// };

// const updateBatsmen = (mainPlayers, batsmens) => {
//   return mainPlayers.map((player) => {
//     const filteredPlayer = batsmens.filter((bat) => bat.id === player.id);
//     if (filteredPlayer && filteredPlayer.length > 0) {
//       const { runs, balls, fours, sixes, isOut } = filteredPlayer[0];

//       return {
//         ...player,
//         runs: player.runs + runs,
//         balls: player.balls + balls,
//         fours: player.fours + fours,
//         sixes: player.sixes + sixes,
//         highestScore: player.highestScore > runs ? player.highestScore : runs,
//         outs: isOut ? player.outs + 1 : player.outs,
//         notOuts: isOut === false ? player.notOuts + 1 : player.notOuts,
//         battingInnings:
//           isOut || isOut === false
//             ? player.battingInnings + 1
//             : player.battingInnings,
//       };
//     }
//     return player;
//   });
// };
