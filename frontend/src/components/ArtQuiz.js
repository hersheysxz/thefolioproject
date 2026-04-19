import React, { useState } from "react";

const quizData = [
  {
    q: "Who painted The Starry Night?",
    a: ["Picasso", "Van Gogh", "Junji Ito"],
    c: 1,
  },
  {
    q: "Which artist is known as a master of body horror?",
    a: ["Monet", "Junji Ito", "Da Vinci"],
    c: 1,
  },
  {
    q: "Surrealism aims to mix reality with what?",
    a: ["History", "Math", "Dreams"],
    c: 2,
  },
];

function ArtQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  const question = quizData[currentIdx];
  const progress = `${currentIdx + 1} / ${quizData.length}`;

  const checkAnswer = (index) => {
    if (answered) return;

    setSelected(index);
    if (index === question.c) {
      setScore((currentScore) => currentScore + 1);
    }

    setAnswered(true);
  };

  const nextQ = () => {
    setCurrentIdx((current) => current + 1);
    setAnswered(false);
    setSelected(null);
  };

  const prevQ = () => {
    setCurrentIdx((current) => current - 1);
    setAnswered(false);
    setSelected(null);
  };

  if (currentIdx >= quizData.length) {
    return (
      <div className="art-quiz">
        <div className="quiz-result-card">
          <span className="quiz-chip">Completed</span>
          <h3>You finished the quiz.</h3>
          <p>
            Final score: <strong>{score}</strong> out of {quizData.length}
          </p>
          <button
            type="button"
            className="quiz-primary-btn"
            onClick={() => window.location.reload()}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="art-quiz">
      <div className="quiz-topbar">
        <span className="quiz-chip">Question {progress}</span>
        <span className="quiz-score">Score {score}</span>
      </div>

      <div className="quiz-question-card">
        <h3>{question.q}</h3>
        <div className="quiz-options">
          {question.a.map((option, i) => {
            let className = "quiz-option";
            if (answered) {
              if (i === question.c) {
                className += " correct";
              } else if (i === selected) {
                className += " incorrect";
              }
            }

            return (
              <button
                key={i}
                type="button"
                className={className}
                onClick={() => checkAnswer(i)}
                disabled={answered}
              >
                <span className="quiz-option-index">{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="quiz-nav">
        <button
          type="button"
          className="quiz-secondary-btn"
          onClick={prevQ}
          disabled={currentIdx === 0}
        >
          Previous
        </button>

        <button
          type="button"
          className="quiz-primary-btn"
          onClick={nextQ}
          disabled={!answered}
        >
          {currentIdx === quizData.length - 1 ? "Finish Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default ArtQuiz;
