import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainPage from "./components/MainPage.js";
import ClubListPage from "./components/ClubListPage.js";
import QuizPage from "./components/QuizPage.js";
import QuizQuestions from "./components/QuizQuestions.js";
import SearchPage from "./components/SearchPage.js";
import FilteredList from "./components/FilteredList.js"
import "./App.css";
import TitleBar from "./components/TitleBar.js";
import Footer from './components/Footer.js';

function App() {

  return (
    <Router>
      <TitleBar />
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <ul className="navbar-links">
            <li><Link to="/" className="navbar-item">Home</Link></li>
            <li><Link to="/clubs" className="navbar-item">Clubs</Link></li>
            <li><Link to="/quiz" className="navbar-item">Quiz</Link></li>
            <li><Link to="/search" className="navbar-item">Search</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/clubs" element={<ClubListPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/question" element={<QuizQuestions />} />
          <Route path="/filter" element={<FilteredList />}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;