import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { Provider } from "react-redux";
import store from "./redux/store";

const initOptions = {
  disableAudioLevels: true
};

window.JitsiMeetJS.init(initOptions);
window.JitsiMeetJS.setLogLevel(window.JitsiMeetJS.logLevels.ERROR); //In this line we specify to Jitsi logger to only log errors

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

