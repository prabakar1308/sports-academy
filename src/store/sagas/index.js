import { all } from "redux-saga/effects";
import { combineWatchers } from "redux-saga-combine-watchers";
import { cricketWatchers } from "./cricket";
import { genericWatchers } from "./dashboard";

export function* rootSaga() {
  yield all(combineWatchers(cricketWatchers, genericWatchers));
}
