import React from 'react';
import "./remotevideo.styles.css";

export const RemoteVideo = (props) => {

  const videoRef = React.createRef();
  const micRef = React.createRef();

  //emulating the componentDidMount
  React.useEffect(() => {
    console.log('%c ***********************', 'background: #87a96b; color: #ffffff');
    console.log("The tracks are: ", props.tracks);
    console.log('%c ***********************', 'background: #87a96b; color: #ffffff');
  }, [])

  return(
    <div className="remotev-container">
      This is the Remotevideo component
      <video autoPlay='1' ref={videoRef}/>
      <audio autoPlay='1' ref={micRef} />
    </div>
  )
};