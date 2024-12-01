import React from 'react';
import '../style/QuizPage.css';
import { Link } from "react-router-dom";

const QuizPage = () => {
    return (
        <div className="quiz-page">
            <h1>Find Your Perfect Club</h1>
            <p>Answer a few questions to discover clubs that match your interests.</p>
            <Link to="/question" className="question-link">
                Start Quiz
            </Link>
        </div>
    );
};

export default QuizPage;