import React from 'react';
import "./videocall.styles.css" ;
import { LocalVideo } from "../../components/localvideo/localvideo.component";
import { RemoteVideo } from "../../components/remotevideo/remotevideo.component";

export const VideoCall = () => {

  return(
    <div className="videocall-container">
      <h2 className="video-call-title">This is the video call page</h2>
      <LocalVideo/>
      <RemoteVideo/>
    </div>
  )
};
