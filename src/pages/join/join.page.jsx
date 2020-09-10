import React, { useEffect } from 'react';
import _ from 'lodash';
import "./join.styles.css"
import { useDispatch, useSelector } from 'react-redux';
import { 
  setPage,
  setDeviceList,
  setMicId,
  setVideoId,
  setSpeakerId,
  setConnection,
  setConference,
  setRemoteTracks
} from "../../redux/actions/video.actions";

export const Join = () => {

  const dispatch = useDispatch();

  const meetingCode = useSelector(state => state.meetingCode);
  const serverURL = useSelector(state => state.serverURL);
  const connection = useSelector(state => state.connection);
  const localTracks = useSelector(state => state.localTracks);
  const remoteTracks = useSelector(state => state.remoteTracks);

  //emulating ComponentDidMount
  useEffect(() => {
    window.JitsiMeetJS.mediaDevices.enumerateDevices((devices) => {
      let newDeviceList = [];
      for(let device of devices){
        newDeviceList.push({ 
          name: device.label, 
          id: device.deviceId, 
          type: device.kind 
        });
      }

      dispatch(setDeviceList(newDeviceList));
      
      let micId = (_.find(newDeviceList, (device) => { return device.type === 'audioinput' && device.id.length > 15}) || {}).id || 'none';
      let videoId = (_.find(newDeviceList, (device) => { return device.type === 'videoinput' && device.id.length > 15}) || {}).id || 'none';
      let speakerId = (_.find(newDeviceList, (device) => { return device.type === 'audioinput' && device.id.length > 15}) || {}).id || 'none';

      dispatch(setMicId(micId));
      dispatch(setVideoId(videoId));
      dispatch(setSpeakerId(speakerId));

      connect();

    })
  }, []);

  //On connect method
  const connect = () => {
    const connectionOptions = {
      hosts: {
        domain: serverURL,
        muc:  `conference.${serverURL}` // FIXME: use XEP-0030
      },
      serviceUrl:  `wss://${serverURL}/xmpp-websocket?room=${meetingCode}`,
      clientNode: `https://${serverURL}`
    }
    
    const jitsiConnection = new window.JitsiMeetJS.JitsiConnection(null, null, connectionOptions);

    jitsiConnection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
    jitsiConnection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
    jitsiConnection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, onConnectionDisconnect);
    jitsiConnection.connect();

    dispatch(setConnection(jitsiConnection));

  };

  //On connection success
  const onConnectionSuccess = () => {

    const conferenceOptions = {
      openBridgeChannel: true
    };

    try{
      const jitsiConference = connection.initJitsiConference(meetingCode, conferenceOptions);
      jitsiConference.addEventListener(window.JitsiMeetJS.events.conference.TRACK_ADDED, onRoomTrackAdded);
      jitsiConference.addEventListener(window.JitsiMeetJS.events.conference.TRACK_REMOVED, onRoomTrackRemoved);
      jitsiConference.join();
      dispatch(setConference(jitsiConference));
    }catch(error){
      //need to save this in a state property
      console.log("Error: ", error);
    }
  };

  //Event handler for added tracks
  const onRoomTrackAdded = (track) => {
    if(track.isLocal() === true){
      return;
    }
    
    let newTrackId = track.getId();
    let matchTrack = _.find(remoteTracks, {id: newTrackId});
    if(matchTrack){
      return;
    }

    let trackInfo = {
      id: newTrackId,
      participantId: track.getParticipantId(),
      type: track.getType(),
      track: track
    }

    dispatch(setRemoteTracks([...remoteTracks, trackInfo]));

  };

  //Event handler for removed tracks
  const onRoomTrackRemoved = (track) => {
    console.log("On room track removed");
  };

  //On connection failure
  const onConnectionFailed = () => {
    console.log("On connection failure");
  };

  //On connection disconnect
  const onConnectionDisconnect = () => {
    console.log("On disconnect");
  };

  //Navigate to Video page
  const joinConference = () => {
    dispatch(setPage("video"));
  };

  return(
    <div className="join-container">
      <div className="video-section">
        <div className="video-component">This is the video Component</div>
      </div>
      <div className="conference-info">
        <h3>Conference Info</h3>
        <p>Meeting code: { meetingCode }</p>
        <button className="join-button" onClick={joinConference} >Join</button>
      </div>
    </div>
  )
};
