import React from 'react';
import _ from 'lodash';
import "./videocall.styles.css" ;
import { LocalVideo } from "../../components/localvideo/localvideo.component";
import { RemoteVideo } from "../../components/remotevideo/remotevideo.component";
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'
import { 
  setPage,
  setDeviceList,
  setMicId,
  setVideoId,
  setSpeakerId,
  setConnection,
  setConference,
  setRemoteTracks,
  setLocalTracks,
  setActiveRoomId
} from "../../redux/actions/video.actions";

export const VideoCall = () => {


  const dispatch = useDispatch();
  const remoteTracks = useSelector(state => state.remoteTracks);
  const meetingCode = useSelector(state => state.meetingCode);
  const serverURL = useSelector(state => state.serverURL);
  const localTracks = useSelector(state => state.localTracks);
  const [ isLoaded, setIsLoaded ] = React.useState(false);

  let jitsiConnection;
  let jitsiConference;

  //emulating ComponentDidMount
  React.useEffect(() => {
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
      

      let micId = (_.find(newDeviceList, { type: 'audioinput' }) || {}).id || 'none';
      let videoId = (_.find(newDeviceList, { type: 'videoinput' }) || {}).id || 'none';
      let speakerId = (_.find(newDeviceList, { type: 'audiooutput' }) || {}).id || 'none';

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
    
    jitsiConnection = new window.JitsiMeetJS.JitsiConnection(null, null, connectionOptions);

    jitsiConnection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
    jitsiConnection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
    jitsiConnection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, onConnectionDisconnect);
    jitsiConnection.connect();

    dispatch(setConnection(jitsiConnection));

  };

  const renderRemoteTracks = () => {
    const content= [];
    for( const id in remoteTracks ){
      if(remoteTracks[id].length < 2)
        return <div>Loading...</div>
      else
        content.push(<RemoteVideo tracks={remoteTracks[id]} />)
    }
    return content;
  };

  //On connection success
  const onConnectionSuccess = () => {

    const conferenceOptions = {
      openBridgeChannel: true
    };
    

    try{
      jitsiConference = jitsiConnection.initJitsiConference(meetingCode, conferenceOptions);
      jitsiConference.addEventListener(window.JitsiMeetJS.events.conference.TRACK_ADDED, onRoomTrackAdded);
      jitsiConference.addEventListener(window.JitsiMeetJS.events.conference.TRACK_REMOVED, onRoomTrackRemoved);
      jitsiConference.addEventListener(window.JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => console.log("CONFERENCE_JOINED"));
      jitsiConference.addEventListener(window.JitsiMeetJS.events.conference.USER_JOINED,  (id) => console.log("USER_JOIN: ", id));
      jitsiConference.addEventListener(window.JitsiMeetJS.events.conference.USER_LEFT,  () => console.log("USER_LEFT"));
      console.log('%c ***********************', 'background: #915c83; color: #ffffff');
      jitsiConference.join();
      console.log('%c ***********************', 'background: #915c83; color: #ffffff');
      dispatch(setConference(jitsiConference));
      dispatch(setActiveRoomId(uuidv4()));
      setIsLoaded(true);
    }catch(error){
      //need to save this in a state property
      console.log("Error: ", error);
    }
  };

   //On connection failure
   const onConnectionFailed = () => {
    console.log("On connection failure");
  };

  //On connection disconnect
  const onConnectionDisconnect = () => {
    console.log("On disconnect");
  };

  //Event handler for added tracks
  const onRoomTrackAdded = (track) => {
    console.log('%c ***********************', 'background: #d9004c; color: #ffffff');
    console.log("Inside onRoomTrackAdded");
    console.log('%c ***********************', 'background: #d9004c; color: #ffffff');
    if(track.isLocal() === true){
      addTrackUtil(localTracks, track);
    }else{
      addTrackUtil(remoteTracks, track);
    }
  };

  const addTrackUtil = (tracks, track) => {
    
    let newTrackId = track.getId();
    
    let matchTrack = _.find(tracks, {id: newTrackId});
    if(matchTrack){
      return;
    }

    let trackInfo = {
      id: newTrackId,
      participantId: track.getParticipantId(),
      type: track.getType(),
      track: track
    }

    if(track.isLocal() === true)
      dispatch(setLocalTracks([...localTracks, trackInfo]));
    else{
      console.log('%c ***********************', 'background: #d9004c; color: #ffffff');
      console.log("Adding remote Track");
      dispatch(setRemoteTracks(trackInfo));
      console.log('%c ***********************', 'background: #d9004c; color: #ffffff');
    }
  };

  //Event handler for removed tracks
  const onRoomTrackRemoved = (track, ...args) => {
    console.log("On room track removed");
    console.log("Track removed: ", track);
    console.log("More data: ", args);
  };

  return(
    <div className="videocall-container">
      <div className="floating-local-video">
      {
            isLoaded ? (
              <LocalVideo/>
            ):(
              <div>Loading...</div>
            )
          }
      </div>
      <div className="videocall-body">
        <div className="remote-videos">
            {
              renderRemoteTracks()
            }
        </div>
      </div>
      <div className="videocall-footer">
      </div>
    </div>
  )
};
