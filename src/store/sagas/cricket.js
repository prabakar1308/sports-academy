// saga.js
import { call, takeLatest, put, take, event } from "redux-saga/effects";
import * as cricketActions from "../actions/cricket";

import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore/lite";
import { db } from "../../database/firebase.db";
import { eventChannel } from "redux-saga";

// function uses axios to fetch data from our api
// let callAPI = async ({ url, method, data }) => {
//   return await Axios({
//     url,
//     method,
//     data,
//   });
// };

export function* fetchCricketTeamsSaga() {
  try {
    const q = query(collection(db, "teams"), orderBy("created", "desc"));
    const d = onSnapshot(q, (querySnapshot) => {
      return querySnapshot.docs.map((doc) => doc.data());
    });
    console.log("dsdsd", d);
    yield put(cricketActions.getCricketTeams([]));
  } catch (e) {
    // yield put({ type: "NUMBER_SAGA_FAILED" });
  }
}

function* getCricketWatcher() {
  yield takeLatest(cricketActions.FETCH_CRICKET_TEAMS, fetchCricketTeamsSaga);
}

export const cricketWatchers = [getCricketWatcher];
