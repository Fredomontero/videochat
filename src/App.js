import React from 'react';
import './App.css';
import { useSelector } from 'react-redux'
import { Home } from "./pages/home/home.page";
import { Join } from "./pages/join/join.page";
import { VideoCall } from "./pages/videocall/videocall.page";

export const App = () => {

  const page = useSelector(state => state.page);

  return(
    <div className="app-container">
      {
        page === 'home' ? (<Home/>):(
        page === 'join' ? (<Join/>):(
          <VideoCall/>
        ))
      }
    </div>
  )
};
