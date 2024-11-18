import React from "react";
import "../style/TitleBar.css";
import logo from "../assets/logo.png"; 

const TitleBar = () => {
  return (
    <header className="title-bar">
      <div className="title-container">
        <img src={logo} alt="PLU Logo" className="logo" />
        <h1>PLU Club Finder</h1>
      </div>
    </header>
  );
};

export default TitleBar;