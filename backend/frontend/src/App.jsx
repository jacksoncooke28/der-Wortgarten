// Top-level app component. Manages global state (vocab list, review mode), fetches data, and wires Garden/ReviewQuiz.
import { useEffect, useState } from "react";
import Garden from "./Garden";
import ReviewQuiz from "./reviewQuiz";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [vocabList, setVocabList] = useState([]);
  const [newGerman, setNewGerman] = useState("");
  const [newEnglish, setNewEnglish] = useState("");
  const [reviewMode, setReviewMode] = useState(false);

  // Fetch welcome message
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to connect to backend."));
  }, []);

  // Fetch all vocab
  // GET /api/vocab and setVocabList. Called on mount and after PUT/DELETE
  const refreshVocab = () => {
    fetch("http://localhost:8000/api/vocab")
      .then((res) => res.json())
      .then((data) => setVocabList(data));
  };

  <ReviewQuiz vocabList={vocabList} onReviewUpdate={refreshVocab} />

  useEffect(() => {
    refreshVocab();
  }, []);
// POST /api/vocab with {german, english}. Guards against empty input; then clears inputs.
  const handleAddWord = () => {
    const newWord = {
      german: newGerman,
      english: newEnglish,
    };

    fetch("http://localhost:8000/api/vocab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWord),
    })
      .then((res) => res.json())
      .then((addedWord) => {
        setVocabList((prev) => [...prev, addedWord]);
        setNewGerman("");
        setNewEnglish("");
      });
  };
// DELETE /api/vocab/:id then filters from local state.
  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/vocab/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setVocabList((prev) => prev.filter((word) => word.id !== id));
      });
  };
// UI magic
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Quicksand', sans-serif",
        backgroundColor: "#e9f5e9",
        minHeight: "100vh",
        color: "#2f3e2f",
      }}
    >
      <h1>🌱 Der Wortgarten</h1>
      <p>{message}</p>

      <button
        onClick={() => setReviewMode(!reviewMode)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#88a47c",
          color: "white",
          cursor: "pointer",
        }}
      >
        {reviewMode ? "Show All Words" : "Start Review Mode"}
      </button>

      <h2>{reviewMode ? "Words to Review" : "Your Vocabulary Garden"}</h2>

      {reviewMode ? (
        <ReviewQuiz
          vocabList={vocabList}
          onReviewUpdate={refreshVocab}
        />
      ) : (
        <Garden vocabList={vocabList} handleDelete={handleDelete} />
      )}

      <h3 style={{ marginTop: "2rem" }}>🌿 Plant a New Word</h3>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="German"
          value={newGerman}
          onChange={(e) => setNewGerman(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="English"
          value={newEnglish}
          onChange={(e) => setNewEnglish(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleAddWord} style={buttonStyle}>
          Plant
        </button>
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  padding: "0.5rem",
  marginRight: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#fdfdf6",
  color: "#000",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#6b8e23",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default App;
