// saga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";

import * as genericActions from "../actions/dashboard";

// set environment variables for api's

// const API = "https://nsa-academy-api-dev.onrender.com";
// const API = "http://localhost:3001";
const API = process.env.REACT_APP_API_URL;

export function* validateLoginPinSaga(action) {
  try {
    const pin = action.payload;
    const res = yield axios.get(`${API}/validate/login/${pin}`);
    if (res.status === 200)
      yield put(genericActions.validateLoginSuccess(res.data));
  } catch (e) {
    // handle error
  }
}

function* getGenericWatcher() {
  yield takeLatest(genericActions.VALIDATE_LOGIN, validateLoginPinSaga);
}

export const genericWatchers = [getGenericWatcher];
