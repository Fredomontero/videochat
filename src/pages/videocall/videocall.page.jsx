import React from 'react';
import "./videocall.styles.css" ;
import { LocalVideo } from "../../components/localvideo/localvideo.component";
import { RemoteVideo } from "../../components/remotevideo/remotevideo.component";
import { useSelector } from 'react-redux';

export const VideoCall = () => {

  const remoteTracks = useSelector(state => state.remoteTracks);

  const renderRemoteTracks = () => {
    for( const id in remoteTracks ){
      console.log('%c ***********************', 'background: #000000; color: #fdee00');
      console.log("REMOTETRACK TO RENDER: ", remoteTracks[id].length);
      console.log('%c ***********************', 'background: #000000; color: #fdee00');
      if(remoteTracks[id].length < 2)
        return <div>Loading...</div>
      else
        return <RemoteVideo tracks={remoteTracks[id]} />
    }
  };

  return(
    <div className="videocall-container">
      <div className="floating-local-video"><LocalVideo/></div>
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
