import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import QuizPage from './components/QuizPage';
import SearchPage from './components/SearchPage';
import ClubListPage from './components/ClubListPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/clubs" element={<ClubListPage />} />
            </Routes>
        </Router>
    );
}

export default App;