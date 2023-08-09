// saga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";

import * as genericActions from "../actions/dashboard";

// set environment variables for api's

// const API = "https://nsa-academy-api-dev.onrender.com";
// const API = "http://localhost:3001";
const API =
  process.env.REACT_APP_API_URL || "https://nsa-academy-api-dev.onrender.com";

export function* validateLoginPinSaga(action) {
  try {
    const { pin, phone } = action.payload;
    const res = yield axios.post(`${API}/validate/login`, {
      pin,
      phone,
    });
    if (res.status === 200)
      yield put(genericActions.validateLoginSuccess(res.data));
    else yield put(genericActions.validateLoginError());
  } catch (e) {
    yield put(genericActions.validateLoginError());
  }
}

export function* registerClientSaga(action) {
  try {
    const res = yield axios.post(`${API}/client/create`, action.payload);
    if (res.status === 200)
      yield put(genericActions.registerClientSuccess(res.data));
    else yield put(genericActions.registerClientError());
  } catch (e) {
    yield put(genericActions.registerClientError());
  }
}

export function* deleteClientSaga(action) {
  try {
    const res = yield axios.delete(`${API}/client/delete/${action.payload}`);
    if (res.status === 200)
      yield put(genericActions.deleteClientSuccess(action.payload));
    else yield put(genericActions.deleteClientError());
  } catch (e) {
    yield put(genericActions.deleteClientError());
  }
}

function* getGenericWatcher() {
  yield takeLatest(genericActions.VALIDATE_LOGIN, validateLoginPinSaga);
  yield takeLatest(genericActions.REGISTER_CLIENT, registerClientSaga);
  yield takeLatest(genericActions.DELETE_CLIENT, deleteClientSaga);
}

export const genericWatchers = [getGenericWatcher];
