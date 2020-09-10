import React from 'react';
import './home.styles.css';
import { useDispatch } from 'react-redux';
import { setPage } from "../../redux/actions/video.actions";

export const Home = () => {

  const dispatch = useDispatch();

  const joinMeeting = () => {
    dispatch(setPage("join"));
  }

  return(
    <div className="home-container">
      <div className="form-container">
        <button onClick={ joinMeeting } className="input-form start-meeting" >Start a meeting</button>
        <input className="input-form" type="text" placeholder="Meeting code"/>
        <button onClick={ joinMeeting } className="input-form join-meeting" >Join meeting</button>
      </div>
    </div>
  )
};
