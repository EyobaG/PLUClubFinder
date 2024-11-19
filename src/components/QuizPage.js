import React from 'react';
import './style/QuizPage.css';

const QuizPage = () => {
    return (
        <div className="quiz-page">
            <h1>Find Your Perfect Club</h1>
            <p>Answer a few questions to discover clubs that match your interests.</p>
            <button className="start-quiz-btn">Start Quiz</button>
        </div>
    );
};

export default QuizPage;