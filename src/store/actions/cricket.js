export const FETCH_CRICKET_TEAMS = "[cricket] FETCH_CRICKET_TEAMS";
// export const FETCH_CRICKET_TEAMS_SUCCESS = "FETCH_CRICKET_TEAMS_SUCCESS";
export const ADD_CRICKET_TEAM = "[cricket] ADD_CRICKET_TEAM";

export const UPDATE_MATCH_DETAILS = "[cricket] UPDATE_MATCH_DETAILS";
export const UPDATE_CRICKET_FIELDS = "[cricket] UPDATE_CRICKET_FIELDS";
export const UPDATE_SCOREBOARD_FIELDS = "[cricket] UPDATE_SCOREBOARD_FIELDS";
export const UPDATE_SCOREBOARD_INNINGS = "[cricket] UPDATE_SCOREBOARD_INNINGS";
export const UPDATE_CURRENT_BOWLER = "[cricket] UPDATE_CURRENT_BOWLER";
export const UPDATE_NEW_BATSMEN = "[cricket] UPDATE_NEW_BATSMEN";
export const ADD_BALL = "[cricket] ADD_BALL";
// to keep the updated values when switching btw scoreboard
export const MAINTAIN_OVER_DETAILS = "[cricket] MAINTAIN_OVER_DETAILS";
export const ADD_CRICKET_PLAYER = "[cricket] ADD_CRICKET_PLAYER";
export const SWITCH_STRIKER = "[cricket] SWITCH_STRIKER";
export const UNDO_SCOREBOARD = "[cricket] UNDO_SCOREBOARD";
export const ARCHIVE_SCOREBOARD = "[cricket] ARCHIVE_SCOREBOARD";
export const END_INNINGS = "[cricket] END_INNINGS";
export const END_MATCH = "[cricket] END_MATCH";
export const UPDATE_MATCH_LIST = "[cricket] UPDATE_MATCH_LIST";
export const SET_MATCH_DETAILS = "[cricket] SET_MATCH_DETAILS";

export const getCricketTeams = (teams) => {
  return {
    type: FETCH_CRICKET_TEAMS,
    payload: teams,
  };
};

// export const getCricketTeamsSuccess = (teams) => {
//   return {
//     type: FETCH_CRICKET_TEAMS_SUCCESS,
//     payload: teams,
//   };
// };

export const addCricketTeam = (team) => {
  return {
    type: ADD_CRICKET_TEAM,
    payload: team,
  };
};

export const updateMatchDetails = (matchDetails) => {
  return {
    type: UPDATE_MATCH_DETAILS,
    payload: matchDetails,
  };
};

export const updateCricketFields = (data) => {
  return {
    type: UPDATE_CRICKET_FIELDS,
    payload: data,
  };
};

export const updateScoreboardFields = (data) => {
  return {
    type: UPDATE_SCOREBOARD_FIELDS,
    payload: data,
  };
};

export const updateScoreboardInnings = (data) => {
  return {
    type: UPDATE_SCOREBOARD_INNINGS,
    payload: data,
  };
};

export const addBall = (data) => {
  return {
    type: ADD_BALL,
    payload: data,
  };
};

export const mainOverDetails = (overs) => {
  return {
    type: MAINTAIN_OVER_DETAILS,
    payload: overs,
  };
};

export const updateCurrentBolwer = (data) => {
  return {
    type: UPDATE_CURRENT_BOWLER,
    payload: data,
  };
};

export const updateNewBatsmen = (data) => {
  return {
    type: UPDATE_NEW_BATSMEN,
    payload: data,
  };
};

export const addCricketPlayer = (data) => {
  return {
    type: ADD_CRICKET_PLAYER,
    payload: data,
  };
};

export const switchStriker = (data) => {
  return {
    type: SWITCH_STRIKER,
    payload: data,
  };
};

export const undoScoreboard = () => {
  return {
    type: UNDO_SCOREBOARD,
  };
};

export const archiveScoreboard = () => {
  return {
    type: ARCHIVE_SCOREBOARD,
  };
};

export const endInnings = (data) => {
  return {
    type: END_INNINGS,
    payload: data,
  };
};

export const endCricketMatch = (data) => {
  return {
    type: END_MATCH,
    payload: data,
  };
};

export const updateMatchList = (data) => {
  return {
    type: UPDATE_MATCH_LIST,
    payload: data,
  };
};

export const setMatchDetails = (data) => {
  return {
    type: SET_MATCH_DETAILS,
    payload: data,
  };
};
