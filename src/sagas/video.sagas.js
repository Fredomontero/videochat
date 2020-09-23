import { /*put, take, fork,*/call, all, takeEvery } from "redux-saga/effects";

export function* helloWorld(){
  yield console.log("onConnectionRquest");
}

export function* onHelloWorld(){
  yield takeEvery("HELLO_WORLD", helloWorld);
}

export function* videoSagas(){
  yield all([
    call(onHelloWorld)
  ])
}