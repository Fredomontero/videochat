import React from 'react';
import "./remotevideo.styles.css";
import { useSelector } from 'react-redux';

export const RemoteVideo = (props) => {

  const videoRef = React.createRef();
  const micRef = React.createRef();

  const remoteTracks = useSelector(state => state.remoteTracks);
  const [ rmtTracks, setRmtTracks ] = React.useState([]);
  const [ userId, setUserId ] = React.useState('');

  //emulating the componentDidMount
  React.useEffect(() => {
    console.log('%c ***********************', 'background: #000000; color: #fdee00');
    console.log("INSIDE REMOTE VIDEO");
    console.log("PROPS INSIDE REMOTEVIDEO: ", props.tracks);
    console.log('%c ***********************', 'background: #000000; color: #fdee00');
    const {tracks} = props;
    for(let index in tracks){

      updateTrack(tracks[index], 'SET');
    }
  }, []);

  //Emulate component did update
  React.useEffect(() => {
    //TODO: Need to see if the remote track for each remote component has been changed, if thats the case, lets rerender
    //TODO: 
    
    console.log("remoteTracks has chanegd");
  }, [remoteTracks]);

  //Method for updating remote tracks
  const updateTrack = (track, action = 'CLEAR') => {
    if(action === "CLEAR"){
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
    <div className="remotev-container">
      <video autoPlay='1' ref={videoRef}/>
      <audio autoPlay='1' ref={micRef} />
    </div>
  )
};