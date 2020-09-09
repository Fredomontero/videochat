import { all, call } from "redux-saga/effects";
import { videoSagas } from "./video.sagas";

export default function* rootSaga(){
  yield all([
    call(videoSagas)
  ])
};