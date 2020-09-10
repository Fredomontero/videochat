import React from 'react';
import "./videocall.styles.css" ;
import { LocalVideo } from "../../components/localvideo/localvideo.component";
import { RemoteVideo } from "../../components/remotevideo/remotevideo.component";

export const VideoCall = () => {

  return(
    <div className="videocall-container">
      <div className="floating-local-video"><LocalVideo/></div>
      <div className="videocall-body">
        <div className="remote-videos">
          <RemoteVideo/>
        </div>
      </div>
      <div className="videocall-footer">
      </div>
    </div>
  )
};
