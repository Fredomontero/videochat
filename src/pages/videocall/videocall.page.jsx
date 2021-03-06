import React from 'react';
import _ from 'lodash';
import "./videocall.styles.css" ;
import { Typography, Grid } from '@material-ui/core';
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
  setActiveRoomId,
  removeRemoteTrack
} from "../../redux/actions/video.actions";
import { useStyles } from './videocall.styles';

export const VideoCall = () => {

  const classes = useStyles();

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

  //Event handler for removed tracks REMOVE--TRACK
  const onRoomTrackRemoved = (track, ...args) => {
    console.log("On room track removed");
    console.log("Track removed: ", track.ownerEndpointId);
    dispatch(removeRemoteTrack(track));
    console.log("More data: ", args);
  };

  const calculateWidth = () => {
    let n;
    let user = [...Object.values(remoteTracks)];
    if(user.length === 1)
      n = 12;
    else if(user.length > 1 && user.length < 5)
      n = 6;
    else if(user.length > 4 && user.length < 10)
      n = 4;
    else if(user.length < 17)
      n = 3;
    return n;
  };

  const calculateHeight = () => {
    let height;
    let user = [...Object.values(remoteTracks)];
    if(user.length === 1)
      height = 100;
    else if(user.length > 1 && user.length < 7)
      height = 50;
    else if(user.length < 13)
      height = 100/3;
    else if(user.length < 17)
      height = 25;
    return height;
  }

  const renderRemoteTracks = () => {
    const content= [];
    for( const id in remoteTracks ){
      if(remoteTracks[id].length < 2)
        return <div>Loading...</div>
      else
        content.push(
          <Grid item container xs={calculateWidth()} className={classes.participant} style={{height: `${calculateHeight()}%`}} id={`${id}`}>
            <RemoteVideo tracks={remoteTracks[id]} />
          </Grid>
        )
    }
    return content;
  };

  return(
    <Grid 
      container 
      className={classes.videoCallContainer}
    >
      <Grid item container className={classes.body}>
        <div className={classes.floatingVideo} >
          {
            isLoaded ? (
              <LocalVideo/>
            ):(
              <div>Loading...</div>
            )
          }
        </div>
        <Grid item container className={classes.participantsContainer} alignItems="center">
          {
            renderRemoteTracks()
          }
        </Grid>
      </Grid>
      <Grid item container className={classes.controlBar}>
        <Typography>This is the footer</Typography>
      </Grid>
    </Grid>
  )
};
