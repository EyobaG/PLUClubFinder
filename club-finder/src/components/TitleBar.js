import React from "react";
import "../style/TitleBar.css";
import logo from "../assets/logo.png"; 
import { Link } from "react-router-dom";

const TitleBar = () => {
  return (
    <header className="title-bar">
      <div className="title-container">
        <Link to="/" className="main-link">
          <img src={logo} alt="PLU Logo" className="logo" />
          PLU Club Finder
        </Link>
      </div>
    </header>
  );
};

export default TitleBar;