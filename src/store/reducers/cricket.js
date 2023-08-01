import { WICKET_TYPES } from "../../modules/cricket/constants";

import { omitProps } from "../../modules/cricket/utils";
import * as cricketActions from "../actions/cricket";
import { getMaidenCount, getOverCount, updateTeamPlayerScore } from "./utils";

// import data from "./cricketData";
// import { updateCurrentBowlerDetails } from "./utils";

// for bowlers
// const bowler = {
//   id,
//   name,
//   wickets,
//   bowlingRuns,
// };

// const batsmen = {
//   id,
//   name,
//   balls
//   runs,
//   strikeRate,
//   fours,
//   sixes
// };

// const RUN_TYPE = {
//   BATSMEN:
// }

// balls
// const ball = {
//   ballNo: 1,
//   over: 1,
//   overBallNo: 1,
//   runs: 2,
//   wide: false,
//   noBall: true,
//   byes: false,
//   batsmen: null,
//   bowler: null,
//   wicket: false,
//   wicketHelped: 0,
//   runOut: false,
// };

const initialState = {
  teams: [],
  matches: [],
  // to trigger save at the end of each over
  canTriggerSave: false,
  matchDetails: {
    team1: null,
    team2: null,
    team1Players: [],
    team2Players: [],
    overs: 10,
    toss: null,
    battingFirst: null,
    playersPerTeam: 11,
    striker: null,
    nonStriker: null,
    openingBowler: null,
    wideAllowed: true,
    noBallAllowed: true,
    byesAllowed: true,
  },
  scoreboard: {
    matchId: 0,
    isMatchCompleted: false,
    isMatchStarted: false,
    resultText: "",
    teamWon: null,
    isFirstInnings: true,
    firstInnings: {
      team: null,
      players: [],
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
    secondInnings: {
      team: null,
      players: [],
      batsmen1: null,
      batsmen2: null,
      currentBowler: null,
      currentOver: 0,
      bowlers: [],
      totalRuns: 0,
      totalBalls: 0,
      balls: [],
      overs: {
        ballNum: 1,
        overNum: 0,
        overBallNum: 1,
      },
      wickets: 0,
      extras: 0,
    },
  },
  scoreboardEntries: [],
  // this will used to save data in db when match or innings closed manually
  // (when scoreboardEntries length is 1)
  unSavedActions: false,
};

const cricketReducer = (state = initialState, action) => {
  switch (action.type) {
    case cricketActions.GET_MATCH_LIST_SUCCESS:
      return {
        ...state,
        matches: action.payload,
      };
    case cricketActions.SET_MATCH_DETAILS: {
      const matches = [...state.matches];
      const match = matches.filter((mat) => mat.matchId === action.payload);
      let details = {};
      if (match.length > 0) {
        const { matchDetails, scoreboard } = match[0];
        details = { matchDetails, scoreboard, scoreboardEntries: [scoreboard] };
      }
      return {
        ...state,
        ...details,
      };
    }
    case cricketActions.FETCH_CRICKET_TEAMS_SUCCESS:
      return {
        ...state,
        teams: action.payload,
      };
    case cricketActions.ADD_CRICKET_TEAM_SUCCESS:
      return {
        ...state,
        teams: [...state.teams, action.payload],
      };
    case cricketActions.ADD_CRICKET_PLAYER_SUCCESS: {
      const { key, value, isBatsmen } = action.payload;
      const innings = {
        ...state.scoreboard[key],
      };
      const players = [
        ...innings.players,
        { ...value, isOut: isBatsmen ? false : null, isRetire: false },
      ];
      return {
        ...state,
        scoreboard: {
          ...state.scoreboard,
          [key]: {
            ...innings,
            players,
          },
        },
      };
    }
    case cricketActions.UPDATE_MATCH_DETAILS:
      return {
        ...state,
        matchDetails: {
          ...state.matchDetails,
          ...action.payload,
        },
      };
    case cricketActions.RESET_MATCH_DETAILS:
      return {
        ...state,
        ...initialState,
      };
    case cricketActions.UPDATE_SCOREBOARD_FIELDS: {
      const scoreboard = {
        ...state.scoreboard,
        ...action.payload,
      };
      return {
        ...state,
        scoreboardEntries: [scoreboard],
        scoreboard,
      };
    }
    case cricketActions.UPDATE_SCOREBOARD_INNINGS:
      return {
        ...state,
        scoreboard: {
          ...state.scoreboard,
          [action.payload.key]: {
            ...state.scoreboard[action.payload.key],
            ...action.payload.value,
          },
        },
      };
    case cricketActions.UPDATE_CRICKET_FIELDS:
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value,
      };

    case cricketActions.UPDATE_CURRENT_BOWLER: {
      const { bowlerKey, currentBowler, newBowler, currentOver } =
        action.payload;
      let innings = {
        ...state.scoreboard[bowlerKey],
      };

      // update maiden
      // const currBalls = innings.balls.filter(
      //   (b) => b.over === innings.currentOver
      // );

      // const isMaiden =
      //   currBalls.length === 6 &&
      //   currBalls.filter((c) => c.runs === 0 || (c.runs && c.byes)).length ===
      //     6;

      // console.log("isMaiden", isMaiden);
      // const maidenCount = isMaiden ? 1 : 0;
      const maidenCount = getMaidenCount(innings);
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

      // const { updatedNewBowler, bowlers } = updateCurrentBowlerDetails(innings, currentBowler, newBowler)

      return {
        ...state,
        canTriggerSave: true,
        scoreboard: {
          ...state.scoreboard,
          [bowlerKey]: {
            ...state.scoreboard[bowlerKey],
            currentBowler: updatedNewBowler,
            bowlers,
            currentOver,
          },
        },
      };
    }
    case cricketActions.UPDATE_NEW_BATSMEN:
      const {
        inningsKey,
        innings2Key,
        batsmenKey,
        newBatsmen,
        wicketType,
        wicketHelpedBy,
        isBatsmenRetire,
        newBatsmenStrike,
      } = action.payload;
      let innings = {
        ...state.scoreboard[inningsKey],
      };
      let innings2 = {
        ...state.scoreboard[innings2Key],
      };
      const batsmens = [...innings.players];
      const fielders = [...innings2.players];

      const fielderIndex = fielders.findIndex(
        (bow) => wicketHelpedBy && bow.id === wicketHelpedBy.id
      );

      if (fielderIndex >= 0 && wicketType.value === WICKET_TYPES.CAUGHT) {
        const catches = fielders[fielderIndex].catches
          ? fielders[fielderIndex].catches + 1
          : 1;
        const updatedFielder = {
          ...fielders[fielderIndex],
          catches,
        };
        fielders.splice(fielderIndex, 1, updatedFielder);
      }

      const batsmenExists = batsmens.findIndex(
        (bat) => bat.id === innings[batsmenKey].id
      );
      const newBatsmenId = newBatsmen ? newBatsmen.id : 0;
      const newBatsmenIndex = batsmens.findIndex(
        (bat) => bat.id === newBatsmenId
      );
      console.log("newBatsmenIndex", newBatsmenIndex);
      if (batsmenExists >= 0) {
        batsmens.splice(batsmenExists, 1, {
          ...innings[batsmenKey],
          isOut: isBatsmenRetire ? false : true,
          isRetire: isBatsmenRetire,
          wicketType: isBatsmenRetire ? null : wicketType,
          wicketHelpedBy: isBatsmenRetire ? null : wicketHelpedBy,
          bowler: innings.currentBowler,
        });
        // batsmens[batsmenExists].isOut = true;
      }
      // console.log("newBatsmenIndex", newBatsmenIndex);
      if (newBatsmenIndex >= 0) {
        batsmens.splice(newBatsmenIndex, 1, {
          ...batsmens[newBatsmenIndex],
          // [INFO]: set as false to mark new batsmen as current bastmen
          isOut: false,
        });
      }
      return {
        ...state,
        scoreboard: {
          ...state.scoreboard,
          [inningsKey]: {
            ...state.scoreboard[inningsKey],
            [batsmenKey]: newBatsmen
              ? {
                  ...newBatsmen,
                  isStriker: newBatsmenStrike,
                  // isStriker:
                  //   wicketType && wicketType.value === WICKET_TYPES.RUNOUT_OTHER
                  //     ? false
                  //     : true,
                  isOut: false,
                  isRetire: false,
                }
              : null,
            players: [...batsmens],
          },
          [innings2Key]: {
            ...state.scoreboard[innings2Key],
            players: [...fielders],
          },
        },
      };

    case cricketActions.ADD_BALL: {
      // console.log("ADD BALL");
      const { bKey, bValue, strikerKey, nonStrikerKey } = action.payload;
      let innings = {
        ...state.scoreboard[bKey],
      };
      if (bValue) {
        // if (bValue.runs) {
        const dotBallsCount =
          (bValue.runs === 0 && !bValue.wide) || bValue.byes ? 1 : 0;
        const foursCount =
          bValue.runs === 4 && !bValue.wide && !bValue.byes ? 1 : 0;
        const sixesCount =
          bValue.runs === 6 && !bValue.wide && !bValue.byes ? 1 : 0;
        const currentRun = bValue.wide || bValue.byes ? 0 : bValue.runs;
        const currentBall = bValue.wide ? 0 : 1;
        const currentBowlingBall = bValue.wide || bValue.noBall ? 0 : 1;
        const currentBowlingRun = bValue.byes ? 0 : bValue.runs;
        const runs = innings[strikerKey].runs
          ? innings[strikerKey].runs + currentRun
          : currentRun;
        // console.log("innings[strikerKey]", innings[strikerKey]);
        const balls = innings[strikerKey].balls
          ? innings[strikerKey].balls + currentBall
          : currentBall;

        const wickets = bValue.wicket ? 1 : 0;
        const extras = bValue.wide || bValue.noBall ? 1 : 0;
        const extraRuns = bValue.wide || bValue.byes ? bValue.runs : 0;
        const bowlingRuns = innings.currentBowler.bowlingRuns
          ? innings.currentBowler.bowlingRuns + currentBowlingRun + extras
          : currentBowlingRun + extras;
        const bowlingBalls = innings.currentBowler.bowlingBalls
          ? innings.currentBowler.bowlingBalls + currentBowlingBall
          : currentBowlingBall;
        const bowlingDotBalls = innings.currentBowler.bowlingDotBalls
          ? innings.currentBowler.bowlingDotBalls + dotBallsCount
          : dotBallsCount;
        const bowlingWickets = innings.currentBowler.wickets
          ? innings.currentBowler.wickets + wickets
          : wickets;

        const strikerUpdate =
          (bValue.runs % 2 === 0 && !bValue.overLastBall && !bValue.runout) ||
          (bValue.runs % 2 > 0 && (bValue.overLastBall || bValue.runout));
        const sr = runs === 0 || balls === 0 ? 0 : (runs * 100) / balls;
        const er = bowlingBalls > 0 ? (bowlingRuns / bowlingBalls) * 6 : 0;

        innings = {
          ...innings,
          totalRuns: innings.totalRuns + bValue.runs + extras,
          totalBalls:
            bValue.wide || bValue.noBall
              ? innings.totalBalls
              : innings.totalBalls + 1,
          extras: innings.extras + extras + extraRuns,
          wickets: innings.wickets + wickets + (bValue.runout ? 1 : 0),
          currentBowler: {
            ...innings.currentBowler,
            bowlingBalls,
            bowlingDotBalls,
            bowlingRuns,
            econRate: Number.isInteger(er) ? er : parseFloat(er).toFixed(2),
            wickets: bowlingWickets,
          },
          [strikerKey]: {
            ...innings[strikerKey],
            runs,
            balls,
            isStriker: strikerUpdate,
            dotBalls: innings[strikerKey].dotBalls
              ? innings[strikerKey].dotBalls + dotBallsCount
              : dotBallsCount,
            fours: innings[strikerKey].fours
              ? innings[strikerKey].fours + foursCount
              : foursCount,
            sixes: innings[strikerKey].sixes
              ? innings[strikerKey].sixes + sixesCount
              : sixesCount,
            strikeRate: Number.isInteger(sr) ? sr : parseFloat(sr).toFixed(2),
          },
          [nonStrikerKey]: {
            ...innings[nonStrikerKey],
            isStriker: !strikerUpdate,
          },
        };
        // }

        // update batsmen
      }
      // const currentScoreboard =
      //   innings.balls && innings.balls.length > 0
      //     ? [{ ...state.scoreboard }]
      //     : [];
      // const currentScoreboard = { ...state.scoreboard };
      // console.log("state.scoreboard[bKey]", state.scoreboard[bKey]);
      return {
        ...state,
        // scoreboardEntries: [...state.scoreboardEntries, currentScoreboard],
        canTriggerSave: false,
        scoreboard: {
          ...state.scoreboard,
          [bKey]: {
            ...innings,
            balls: [
              ...state.scoreboard[bKey].balls,
              {
                ...bValue,
                // overBallNo:
                //   bValue.wide || bValue.noBall
                //     ? bValue.overBallNo - 1
                //     : bValue.overBallNo,
              },
            ],
          },
        },
      };
    }
    case cricketActions.UNDO_SCOREBOARD: {
      const scoreboardEntries = [...state.scoreboardEntries];
      const lastEntry =
        scoreboardEntries.length > 0
          ? scoreboardEntries.pop()
          : { ...state.scoreboard };
      return {
        ...state,
        scoreboard: lastEntry,
        scoreboardEntries,
      };
    }
    case cricketActions.ARCHIVE_SCOREBOARD: {
      const scoreboard = { ...state.scoreboard };
      return {
        ...state,
        scoreboardEntries: [...state.scoreboardEntries, scoreboard],
      };
    }

    case cricketActions.SWITCH_STRIKER: {
      const { inningsKey, strikerKey, nonStrikerKey } = action.payload;
      return {
        ...state,
        scoreboard: {
          ...state.scoreboard,
          [inningsKey]: {
            ...state.scoreboard[inningsKey],
            [strikerKey]: {
              ...state.scoreboard[inningsKey][strikerKey],
              isStriker: false,
            },
            [nonStrikerKey]: {
              ...state.scoreboard[inningsKey][nonStrikerKey],
              isStriker: true,
            },
          },
        },
      };
    }
    case cricketActions.MAINTAIN_OVER_DETAILS: {
      const { key, overs } = action.payload;
      return {
        ...state,
        scoreboard: {
          ...state.scoreboard,
          [key]: {
            ...state.scoreboard[key],
            overs,
          },
        },
      };
    }
    case cricketActions.END_INNINGS: {
      const {
        striker,
        nonStriker,
        bowler,
        startLater,
        penaltyRuns,
        unSavedActions = false,
      } = action.payload;
      let secondInnings = {
        ...state.scoreboard.secondInnings,
      };
      if (!startLater) {
        secondInnings = {
          ...state.scoreboard.secondInnings,
          batsmen1: omitProps("value", {
            ...striker,
            isStriker: true,
            isOut: false,
          }),
          batsmen2: omitProps("value", { ...nonStriker, isOut: false }),
          players: secondInnings.players.map((player) => ({
            ...player,
            // [INFO]: isOut: null --> yet to bat & isOut: false ---> current batsmens
            isOut:
              striker.id === player.id || nonStriker.id === player.id
                ? false
                : null,
            isRetire: false,
          })),
          currentBowler: omitProps("value", bowler),
        };
      }

      // update batsmen & bowlers
      let firstInnings = { ...state.scoreboard.firstInnings };
      let { batsmen1, batsmen2, currentBowler } = firstInnings;
      let players = [...firstInnings.players];
      let bowlers = [...firstInnings.bowlers];
      // batsmen1
      if (batsmen1) {
        const batsmen1Exists = players.findIndex(
          (bat) => bat.id === batsmen1.id
        );
        if (batsmen1Exists >= 0) {
          players.splice(batsmen1Exists, 1, { ...batsmen1, isOut: false });
        } else {
          players.push({ ...batsmen1, isOut: false });
        }
      }
      // batsmen 2
      if (batsmen2) {
        const batsmen2Exists = players.findIndex(
          (bat) => bat.id === batsmen2.id
        );
        if (batsmen2Exists >= 0) {
          players.splice(batsmen2Exists, 1, { ...batsmen2, isOut: false });
        } else {
          players.push({ ...batsmen2, isOut: false });
        }
      }
      // bowler
      const bowlerExists = bowlers.findIndex(
        (bow) => bow.id === currentBowler.id
      );

      const maidenCount = getMaidenCount(firstInnings);
      const updatedCurrentBowler = {
        ...currentBowler,

        overs: currentBowler.overs
          ? currentBowler.overs + getOverCount(firstInnings)
          : getOverCount(firstInnings),
        maidens: currentBowler.maidens
          ? currentBowler.maidens + maidenCount
          : maidenCount,
      };
      if (bowlerExists >= 0) {
        bowlers.splice(bowlerExists, 1, updatedCurrentBowler);
      } else {
        bowlers.push(updatedCurrentBowler);
      }

      return {
        ...state,
        scoreboard: {
          ...state.scoreboard,
          isFirstInnings: false,
          secondInnings,
          firstInnings: {
            ...firstInnings,
            bowlers,
            players,
            totalRuns: firstInnings.totalRuns + penaltyRuns,
          },
        },
        unSavedActions,
      };
    }
    case cricketActions.END_MATCH: {
      const {
        resultText = "RCB won by 1 runs!",
        teamWon = { ...state.matchDetails.team1 },
        unSavedActions = false,
      } = action.payload || {};

      // update batsmen & bowlers
      let secondInnings = { ...state.scoreboard.secondInnings };
      let { batsmen1, batsmen2, currentBowler } = secondInnings;

      let players = [...secondInnings.players];
      let bowlers = [...secondInnings.bowlers];
      // batsmen1
      const batsmen1Exists = players.findIndex((bat) => bat.id === batsmen1.id);
      if (batsmen1Exists >= 0) {
        players.splice(batsmen1Exists, 1, { ...batsmen1, isOut: false });
      } else {
        players.push({ ...batsmen1, isOut: false });
      }
      // batsmen 2
      const batsmen2Exists = players.findIndex((bat) => bat.id === batsmen2.id);
      if (batsmen2Exists >= 0) {
        players.splice(batsmen2Exists, 1, { ...batsmen2, isOut: false });
      } else {
        players.push({ ...batsmen2, isOut: false });
      }
      // bowler
      const bowlerExists = bowlers.findIndex(
        (bow) => bow.id === currentBowler.id
      );
      const maidenCount = getMaidenCount(secondInnings);
      const updatedCurrentBowler = {
        ...currentBowler,

        overs: currentBowler.overs
          ? currentBowler.overs + getOverCount(secondInnings)
          : getOverCount(secondInnings),
        maidens: currentBowler.maidens
          ? currentBowler.maidens + maidenCount
          : maidenCount,
      };
      if (bowlerExists >= 0) {
        bowlers.splice(bowlerExists, 1, updatedCurrentBowler);
      } else {
        bowlers.push(updatedCurrentBowler);
      }

      const scoreboard = {
        ...state.scoreboard,
        isMatchCompleted: true,
        resultText,
        teamWon,
        secondInnings: {
          ...secondInnings,
          players,
          bowlers,
        },
      };

      // update players
      const { team1Players, team2Players } = updateTeamPlayerScore(scoreboard, {
        ...state.matchDetails,
      });

      console.log(team1Players, team2Players);

      return {
        ...state,
        scoreboard,
        matchDetails: {
          ...state.matchDetails,
          team1Players,
          team2Players,
        },
        unSavedActions,
      };
    }
    case cricketActions.SAVE_CRICKET_MATCH_SUCCESS: {
      const entries = [...state.scoreboardEntries];
      if (entries.length > 1) {
        return { ...state, scoreboardEntries: [entries[entries.length - 1]] };
      }
      return state;
    }
    case cricketActions.DELETE_MATCH_SUCCESS: {
      const matchId = action.payload;
      const matches = [...state.matches].filter((mat) => mat.id !== matchId);
      return { ...state, matches };
    }
    case cricketActions.REFRESH_SCOREBOARD_SUCCESS: {
      if (action.payload) {
        const { matchDetails, scoreboard } = action.payload;
        const details = { matchDetails, scoreboard, scoreboardEntries: [scoreboard] };
        return {
          ...state,
          ...details,
        };
      }
      return state;
    }
    default:
      return state;
  }
};
export default cricketReducer;
