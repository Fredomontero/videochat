import React from 'react';
import "./remotevideo.styles.css";
import { useSelector } from 'react-redux';

export const RemoteVideo = (props) => {

  const videoRef = React.createRef();
  const micRef = React.createRef();

  // const remoteTracks = useSelector(state => state.remoteTracks);
  // const [ rmtTracks, setRmtTracks ] = React.useState([]);
  const [ userId, setUserId ] = React.useState('');
  const {tracks} = props;

  //emulating the componentDidMount
  React.useEffect(() => {
    console.log('%c ***********************', 'background: #000000; color: #fdee00');
    console.log("INSIDE REMOTE VIDEO");
    console.log("PROPS INSIDE REMOTEVIDEO: ", props.tracks);
    console.log('%c ***********************', 'background: #000000; color: #fdee00');
    
    for(let index in tracks){
      console.log("[inside For]")
      updateTrack(tracks[index], 'SET');
    }
  }, [tracks]);

  //Emulate component did update
  // React.useEffect(() => {
  //   //TODO: Need to see if the remote track for each remote component has been changed, if thats the case, lets rerender
  //   //TODO: 
    
  //   console.log("remoteTracks has chanegd");
  //   console.log("--- remoteTracks: ", remoteTracks);
  // }, [remoteTracks]);

  //Method for updating remote tracks
  const updateTrack = (track, action = 'CLEAR') => {
    console.log("Data: ", track);
    console.log("Action: ", action);
    if(action === "CLEAR"){
      console.log("Inside CLEAR")
      switch(track.type){
        case 'audio' :
          if(videoRef.current){
            track.track.detach(micRef.current);
          }
          break;
        case 'video':
          if(videoRef.current){
            track.track.detach(videoRef.current);
          }
          break;
        default:
          break;
      }
    }else{
      console.log("Inside ELSE")
      switch(track.type){
        case 'audio': 
          if(micRef.current){
            track.track.attach(micRef.current);
          }
          break;
        case 'video':
          if(videoRef.current){
            track.track.attach(videoRef.current);
          }
          break;
        default:
          break;
      }
    }
  };

  return(
    <React.Fragment>
      <video className='video-tag' autoPlay='1' ref={videoRef} />
      <audio autoPlay='1' ref={micRef} />
      <div className="userID" >{tracks[0].participantId}</div>
    </React.Fragment>
  )
};