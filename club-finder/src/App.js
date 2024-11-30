import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainPage from "./components/MainPage";
import ClubListPage from "./components/ClubListPage";
import QuizPage from "./components/QuizPage";
import SearchPage from "./components/SearchPage";
import "./App.css";
import TitleBar from "./components/TitleBar";
import Footer from './components/Footer';

function App() {
  const [clubs, setClubs] = useState([]);  // State to hold clubs data

  // Fetch club data from the server when the component mounts
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        // Update the URL to match the backend server URL (localhost:5000)
        const response = await fetch("http://localhost:5000/ClubFinder");
        if (!response.ok) {
          throw new Error("Error fetching clubs data");
        }
        const data = await response.json();
        setClubs(data);  // Set the fetched clubs data into state
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs(); // Fetch clubs when the component is mounted
  }, []); // Empty dependency array to run once when the component mounts

  return (
    <Router>
      <TitleBar />
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <ul className="navbar-links">
            <li>
              <Link to="/" className="navbar-item">Home</Link>
            </li>
            <li>
              <Link to="/clubs" className="navbar-item">Clubs</Link>
            </li>
            <li>
              <Link to="/quiz" className="navbar-item">Quiz</Link>
            </li>
            <li>
              <Link to="/search" className="navbar-item">Search</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/clubs"
            element={<ClubListPage clubs={clubs} />}  // Pass fetched clubs data to ClubListPage component
          />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;