import React, { useState } from "react";
import '../style/QuizQuestions.css';

function QuizQuestion() {
  // State to track the current question and answers
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [missingFlag, setMissingFlag] = useState(false);

  // Quiz questions with varying input types
  const questions = [
    {
        id: 1,
        question: "Are you interested in athletics",
        type: "radio",
        options: ["Yes", "No"],
    },
    {
        id: 2,
        question: "Are you competitive?",
        type: "radio",
        options: ["Yes", "No"],
    },
    {
        id: 3,
        question: "Are you interested in being in ROTC?",
        type: "radio",
        options: ["Yes", "No"],
    },
    {
        id: 4,
        question: "Select all of the school subjects that you like",
        type: "checkbox",
        options: ["Mathematics", "English", "History", "Lab Sciences", "Social Sciences", "Music", "Health"],
    },
    {
        id: 5,
        question: "Do you like getting involved in your community",
        type: "radio",
        options: ["Yes","No"],
    },
    {
        id: 6,
        question: "Would you describe yourself as a creative/artistic person?",
        type: "radio",
        options: ["Yes","No"],
    },
    {
        id: 7,
        question: "Are you interested in music",
        type: "radio",
        options: ["Yes", "No"],
    },
    {
        id: 8,
        question: "Are you interested in the performing arts?",
        type: "radio",
        options: ["Yes", "No"],
    },
    {
        id: 9,
        question: "Are you interested in tabletop games?",
        type: "radio",
        options: ["Yes","No"],
    },
    {
        id: 10,
        question: "Are you interested in religious clubs?",
        type: "radio",
        options: ["Yes","No"],
    },
    {
      id: 11,
      question: "Are you interested in Outdoor Rec",
      type: "radio",
      options: ["Yes", "No"],
    },
  ];

  // Handler for input changes
  const handleAnswerChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAnswers((prevAnswers) => {
      if (type === "checkbox") {
        const currentValues = prevAnswers[name] || [];
        return {
          ...prevAnswers,
          [name]: checked
            ? [...currentValues, value]
            : currentValues.filter((v) => v !== value),
        };
      } else {
        return { ...prevAnswers, [name]: value };
      }
    });
  };


  const validateForm = () => {
    const question = questions[currentQuestion];
    const answer = answers[`question-${question.id}`];
    if (question.type === "radio") {
      if (!answer) {
        return false;
      }
    }
    return true;
  };
  // Handler for the next button
  const handleNextQuestion = () => {
    const currentAnswer = answers[`question-${questions[currentQuestion].id}`];
    if (validateForm()) {
      setMissingFlag(false);
      if (currentQuestion === 5) {
        console.log("flag");
      }
      if (currentQuestion === 0 && currentAnswer === "No") {
        setCurrentQuestion((prev) => prev + 2); // Skip to question 3
      } else if (currentQuestion === 5 && currentAnswer === "No") {
        setCurrentQuestion((prev) => prev + 3);
      } else if (currentQuestion === 5 && currentAnswer === "Yes") {
        if (answers['question-4'] && answers[`question-4`].includes("Music")) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          setCurrentQuestion((prev) => prev + 2);
        }
      } else {
        setCurrentQuestion((prev) => prev + 1); // Proceed to the next question normally
      }
    } else {
      setMissingFlag(true);
    }
  };

  // Render the current question
  const renderQuestion = () => {
    const question = questions[currentQuestion];

    if (question.type === "radio") {
      return question.options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={answers[`question-${question.id}`] === option}
            onChange={handleAnswerChange}
          />
          {option}
        </label>
      ));
    }

    if (question.type === "checkbox") {
      return question.options.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            name={`question-${question.id}`}
            value={option}
            checked={(answers[`question-${question.id}`] || []).includes(
              option
            )}
            onChange={handleAnswerChange}
          />
          {option}
        </label>
      ));
    }

    return null;
  };

  return (
    <div className="questions-page">
      <h1>Quiz!!</h1>
      {currentQuestion < questions.length ? (
        <div>
          <p>{questions[currentQuestion].question}</p>
          {renderQuestion()}
          <br />
          <button onClick={handleNextQuestion}>Next</button>
          {missingFlag && <h3 style={{ color: "red" }}>Please provide an answer</h3>}
        </div>
      ) : (
        <div>
          <h2>Quiz Complete!</h2>
          <p>Your Answers:</p>
          <pre>{JSON.stringify(answers, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default QuizQuestion;