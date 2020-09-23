import React from 'react';
import _ from 'lodash'
import { useDispatch, useSelector, connect } from 'react-redux';
import "./localvideo.styles.css";

export const LocalVideo = () => {

  const connection = useSelector(state => state.connection);
  const conference = useSelector(state => state.conference);
  const deviceList = useSelector(state => state.deviceList);
  const videoRef = React.createRef();
  const micRef = React.createRef();

  const [ tempLocalTracks, setTempLocalTracks ] = React.useState([]);

  React.useEffect(() => {
    console.log("The connection is: ", connection);
    console.log("The conference is: ", conference);

    window.JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video']})
    .then((tracks) => {
      console.log("The tracks are: ", tracks);
      let devicesIds = _.map(deviceList, device => device.id);
      console.log(" DevicesIds: ", devicesIds);
      for(let track of tracks){
        if( _.indexOf(devicesIds, track.deviceId) !== -1 ){
          setTempLocalTracks( previousState => [...previousState, track] );
          track.addEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => console.log(`Audio Level local: ${audioLevel}`));
          track.addEventListener(window.JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => console.log('local track muted'));
          track.addEventListener(window.JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => console.log('local track stoped'));
          track.addEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, deviceId => console.log(`track audio output device was changed to ${deviceId}`));
          conference.addTrack(track)
          .then(response => console.log("Response: ", response))
          .catch(error => console.log("The error is: ", error));
        }
      }
    });
    return () => {
      for(let track of tempLocalTracks){
        console.log("***********************");
        console.log("REMOVING TRACK: ", track);
        console.log("***********************");
        updateLocalTrack(track, 'CLEAR');
      }
    }
  }, []);

  React.useEffect(() => {
    let size = tempLocalTracks.length;
    if(size > 0){
      console.log("Just add: ", tempLocalTracks[size-1]);
      updateLocalTrack(tempLocalTracks[size-1], 'SET');
    }
  }, [tempLocalTracks]);

  //Method for updating local tracks
  const updateLocalTrack = (track, action = 'CLEAR') => {
    if(action === "CLEAR"){
      switch(track.type){
        case 'audio':
          if(micRef.current){
            track.detach(micRef.current);
            track.removeEventListener(window.JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onTrackStoppedEvent);
            track.removeEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOutputChangedEvent);
            track.dispose();
          }
          break;
        case 'video':
          if(videoRef.current){
            track.detach(videoRef.current);
            track.dispose();
          }
          break;
        default:
          break;
      }
    }else{
      switch(track.type){
        case 'audio':
          if(micRef.current){
            track.attach(micRef.current);
            track.addEventListener(window.JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onTrackStoppedEvent);
            track.addEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOutputChangedEvent);
            track.mute();
          }
          break;
        case 'video':
          if(track && videoRef.current){
            track.attach(videoRef.current);
          }
          break;
        default:
          break;
      }
    }
  };

  const onTrackStoppedEvent = () => {

  };

  const onTrackAudioOutputChangedEvent = () => {

  };


  return(
    <div className="localv-container">
      <video className="video-component" autoPlay='1' ref={videoRef}/>
      {/* <audio className="audio-component" autoPlay='1' muted={true} ref={micRef} /> */}
    </div>
  )
};