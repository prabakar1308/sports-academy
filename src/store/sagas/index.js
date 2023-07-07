import { all } from "redux-saga/effects";
import { combineWatchers } from "redux-saga-combine-watchers";
import { cricketWatchers } from "./cricket";

export function* rootSaga() {
  yield all(combineWatchers(cricketWatchers));
}
