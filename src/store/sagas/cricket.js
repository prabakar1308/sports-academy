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

export const getTeams = async () => {
  let error;
  try {
    console.log("Dfdfsewwe");
    const q = query(collection(db, "teams"), orderBy("created", "desc"));
    // const d = await onSnapshot(q);
    const d = await onSnapshot(q, (querySnapshot) => {
      return querySnapshot.docs.map((doc) => doc.data());
    });
    console.log(d);
    return d;
  } catch (error) {
    error = error.message;
    return error;
  }
};

export function* fetchCricketTeamsSaga() {
  try {
    const q = query(collection(db, "teams"), orderBy("created", "desc"));
    const d = yield call(() =>
      onSnapshot(q, (querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data());
      })
    );
    // console.log("ddfdfdfdf", d.data);
    // const response = yield new Promise(getTeams);
    // const response = yield call(getTeams);
    // console.log("dsdsd", response);
    // yield put(cricketActions.getCricketTeams([]));
  } catch (e) {
    // yield put({ type: "NUMBER_SAGA_FAILED" });
  }
}

function* getCricketWatcher() {
  yield takeLatest(cricketActions.FETCH_CRICKET_TEAMS, fetchCricketTeamsSaga);
}

export const cricketWatchers = [getCricketWatcher];
