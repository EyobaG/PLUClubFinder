import React from "react";
import { Link } from "react-router-dom";
import "../style/MainPage.css";

const MainPage = () => {
  const sampleClubs = ["Drama Club", "Chess Club", "Coding Club", "Photography Club"];
  return (
    <div className="main-page">
      <div className="welcome">
        <h1>Welcome to PLU Club Finder!</h1>
      </div>
      <p>Find the clubs that match your interests!</p>
      
      {/* Quiz Section */}
      <div className="quiz-section">
        <h2>Take the Quiz</h2>
        <p>Answer a few questions to find clubs that align with your interests.</p>
        <Link to="/quiz" className="quiz-link">
          Start Quiz
        </Link>
      </div>
    

      <div className="club-list-page">
      <h1>List of Clubs</h1>
      <ul className="club-list">
          {sampleClubs.map((club, index) => (
              <li key={index}>{club}</li>
          ))}
      </ul>
      </div>
    </div>
  );
};

export default MainPage;