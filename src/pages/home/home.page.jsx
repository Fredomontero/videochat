import React from 'react';
import './home.styles.css'; 

export const Home = () => {

  return(
    <div className="home-container">
      <div className="form-container">
        <button className="input-form" >Start a meeting</button>
        <input className="input-form"  type="text"/>
        <button className="input-form" >Join meeting</button>
      </div>
    </div>
  )
};
