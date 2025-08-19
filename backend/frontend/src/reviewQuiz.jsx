// Quiz flow. Accepts vocabList and onReviewUpdate; computes correctness, PUTs partial update, then triggers refresh.
import React, { useState, useEffect } from "react";

function ReviewQuiz({ vocabList, onReviewUpdate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [direction, setDirection] = useState("de-to-en"); // or "en-to-de"
  const [submitting, setSubmitting] = useState(false);

  const hasWords = Array.isArray(vocabList) && vocabList.length > 0;
  const currentWord = hasWords ? vocabList[currentIndex] : null;

  // Reset input/feedback when the index changes
  useEffect(() => {
    setInput("");
    setShowFeedback(false);
    setIsCorrect(false);
    setSubmitting(false);
  }, [currentIndex]);

  // Defensive early return
  if (!hasWords || !currentWord) {
    return <div style={{ padding: "1rem" }}>No words to review.</div>;
  }

  const prompt = direction === "de-to-en" ? currentWord.german : currentWord.english;
  const correctAnswer =
    (direction === "de-to-en" ? currentWord.english : currentWord.german)?.trim().toLowerCase() || "";
  // compares answer, computes newScore, PUTs {review_score, last_reviewed}, then calls onReviewUpdate().
  const handleSubmit = async () => {
    if (submitting) return; // prevent double clicks
    const userAnswer = input.trim().toLowerCase();
    const correct = userAnswer === correctAnswer;

    setSubmitting(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    // Safeguard if review_score is missing
    const currentScore = Number.isInteger(currentWord.review_score)
      ? currentWord.review_score
      : 0;

    const newScore = correct ? Math.min(currentScore + 1, 5) : 0;

    try {
      const res = await fetch(`http://localhost:8000/api/vocab/${currentWord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review_score: newScore,
          last_reviewed: new Date().toISOString().slice(0, 10),
        }),
      });

      if (!res.ok) {
        throw new Error(`PUT failed with status ${res.status}`);
      }

      const updated = await res.json();
      // Optional: log to verify backend returns updated score
      // console.log("Updated word:", updated);

      // Ask parent to refresh vocabList so Garden icons update
      if (typeof onReviewUpdate === "function") onReviewUpdate();
    } catch (err) {
      console.error("Error updating review score:", err);
    } finally {
      setSubmitting(false);
    }
  };
  // advances to the next word (wraps). Enter key submits/advances via onKeyDown.
  const handleNext = () => {
    if (!hasWords) return;
    setCurrentIndex((prev) => (prev + 1) % vocabList.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !showFeedback) {
      handleSubmit();
    } else if (e.key === "Enter" && showFeedback) {
      handleNext();
    }
  };
  // more UI magic
  return (
    <div style={{ padding: "1rem" }}>
      <h3>
        Review Mode: {direction === "de-to-en" ? "German → English" : "English → German"}
      </h3>

      <button
        onClick={() =>
          setDirection(direction === "de-to-en" ? "en-to-de" : "de-to-en")
        }
        style={{ marginBottom: "1rem" }}
      >
        Switch Direction
      </button>

      <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{prompt}</div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your answer"
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />

      {!showFeedback ? (
        <button
          onClick={handleSubmit}
          style={{ marginLeft: "0.5rem" }}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {isCorrect ? (
            <div style={{ color: "green" }}>✅ Correct!</div>
          ) : (
            <div style={{ color: "red" }}>
              ❌ Incorrect. Correct answer: <strong>{correctAnswer}</strong>
            </div>
          )}
          <button onClick={handleNext} style={{ marginTop: "0.5rem" }}>
            Next Word
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewQuiz;
