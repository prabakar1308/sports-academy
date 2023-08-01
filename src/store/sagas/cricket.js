// saga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
// import { Timestamp } from "firebase/firestore/lite";

import * as cricketActions from "../actions/cricket";
import * as genericActions from "../actions/dashboard";

// set environment variables for api's

// const API = "https://nsa-academy-api-dev.onrender.com";
// const API = "http://localhost:3001";
const API =
  process.env.REACT_APP_API_URL || "https://nsa-academy-api-dev.onrender.com";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function* fetchCricketTeamsSaga(action) {
  try {
    const { clientId } = action.payload;
    console.log("clientId", clientId);
    const res = yield axios.get(`${API}/cricket/teams/${clientId}`);
    yield put(cricketActions.getCricketTeamsSuccess(res.data));
  } catch (e) {
    // handle error
  }
}

export function* addCricketTeamSaga(action) {
  try {
    const team = action.payload;
    const res = yield axios.post(`${API}/cricket/create/team`, team);
    if (res.status === 200)
      yield put(cricketActions.addCricketTeamSuccess(team));
  } catch (e) {
    // handle error
  }
}

export function* getPlayersByTeamSaga(action) {
  try {
    const { key, teamKey, team } = action.payload;
    const res = yield axios.get(`${API}/cricket/getPlayers/${team?.id}`);
    if (res.status === 200) {
      yield put(
        cricketActions.updateMatchDetails({
          [key]: res.data,
          [teamKey]: team,
        })
      );
    }
  } catch (e) {
    // handle error
  }
}

export function* createPlayerBeforeStartSaga(action) {
  try {
    const { apiData, actionData } = action.payload;
    const res = yield axios.post(`${API}/cricket/create/player`, apiData);
    if (res.status === 200)
      yield put(cricketActions.updateMatchDetails(actionData));
  } catch (e) {
    // handle error
  }
}

export function* addCricketPlayerSaga(action) {
  try {
    const { key, value, isBatsmen } = action.payload;
    const res = yield axios.post(`${API}/cricket/create/player`, value);
    if (res.status === 200)
      yield put(
        cricketActions.addCricketPlayerSuccess({ key, value, isBatsmen })
      );
  } catch (e) {
    // handle error
  }
}

export function* updateMatchSaga(action) {
  try {
    const {
      scoreboard,
      matchDetails,
      fields = {},
      saveAction = false,
    } = action.payload;
    const client = JSON.parse(sessionStorage.getItem("client"));
    const data = {
      clientId: client ? client.clientId : 0,
      matchId: !isEmpty(fields) ? fields.matchId : scoreboard.matchId,
      matchDetails,
      scoreboard: {
        ...scoreboard,
        ...fields,
      },
      created: Date.parse(new Date()) / 1000,
    };
    const res = yield axios.post(`${API}/cricket/create/match`, data);
    if (res.status === 200) {
      if (!isEmpty(fields))
        yield put(cricketActions.updateScoreboardFields(fields));
      else if (saveAction) yield put(cricketActions.saveCricketMatchSuccess());
    }
  } catch (e) {
    // handle error
  }
}

export function* getCricketMatchesSaga(action) {
  try {
    const { clientId } = action.payload;
    console.log("clientId", clientId);
    const res = yield axios.get(`${API}/cricket/matches/${clientId}`);
    yield put(cricketActions.getMatchListSuccess(res.data));
    yield put(genericActions.switchProgressLoader(false));
  } catch (e) {
    // handle error
  }
}

export function* refreshCricketMatchSaga(action) {
  try {
    const matchId = action.payload;
    const res = yield axios.get(`${API}/cricket/match/${matchId}`);
    if (res.status === 200) {
      const data = res.data && res.data.length > 0 ? res.data[0] : null;
      yield put(cricketActions.refreshScoreboardSuccess(data));
      yield put(genericActions.switchProgressLoader(false));
    }
  } catch (e) {
    // handle error
  }
}

export function* updateMatchPlayersSaga(action) {
  try {
    const res = yield axios.post(
      `${API}/cricket/update/players`,
      action.payload
    );
    if (res.status === 200) console.log(res);
  } catch (e) {
    // handle error
  }
}

export function* deleteCricketMatchSaga(action) {
  try {
    const res = yield axios.delete(
      `${API}/cricket/delete/match/${action.payload}`
    );
    if (res.status === 200)
      yield put(cricketActions.deleteCricketMatchSuccess(action.payload));
  } catch (e) {
    // handle error
  }
}

function* getCricketWatcher() {
  yield takeLatest(cricketActions.ADD_CRICKET_TEAM, addCricketTeamSaga);
  yield takeLatest(cricketActions.GET_CRICKET_TEAMS, fetchCricketTeamsSaga);
  yield takeLatest(
    cricketActions.CREATE_PLAYER_BEFORE_START,
    createPlayerBeforeStartSaga
  );
  yield takeLatest(cricketActions.ADD_CRICKET_PLAYER, addCricketPlayerSaga);
  yield takeLatest(cricketActions.GET_PLAYERS_BY_TEAM, getPlayersByTeamSaga);
  yield takeLatest(cricketActions.SAVE_CRICKET_MATCH, updateMatchSaga);
  yield takeLatest(cricketActions.GET_MATCH_LIST, getCricketMatchesSaga);
  yield takeLatest(cricketActions.UPDATE_MATCH_PLAYERS, updateMatchPlayersSaga);
  yield takeLatest(cricketActions.DELETE_MATCH, deleteCricketMatchSaga);
  yield takeLatest(cricketActions.REFRESH_SCOREBOARD, refreshCricketMatchSaga);
}

export const cricketWatchers = [getCricketWatcher];
