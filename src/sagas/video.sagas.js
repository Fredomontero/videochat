import { /*put, take, fork,*/call, all, takeEvery } from "redux-saga/effects";

export function* connectionRequest(){
  yield console.log("onConnectionRquest");
}

export function* onConnectionRequest(){
  yield takeEvery("CONNECTION_REQUEST", connectionRequest);
}

export function* onHelloWorld(){
  yield takeEvery("HELLO_WORLD", helloWorld);
}

export function* videoSagas(){
  yield all([
    call(onHelloWorld)
  ])
}