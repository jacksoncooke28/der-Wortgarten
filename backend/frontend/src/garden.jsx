import React from "react";
import { motion } from "framer-motion";

function getPlantEmoji(score) {
  const stages = ["🥀", "🌱", "🌿", "🌼", "🌸", "🌳"];
  return stages[score] || "❓";
}

function Garden({ vocabList, handleDelete }) {
  return (
    <div style={styles.garden}>
      {vocabList.map((word) => (
        <motion.div
          key={`${word.id}-${word.review_score}`}
          style={styles.plot}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            key={word.review_score}
            style={styles.plant}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {getPlantEmoji(word.review_score)}
          </motion.div>
          <div style={styles.label}>{word.german}</div>
          <button
            style={styles.deleteButton}
            onClick={() => handleDelete(word.id)}
          >
            ❌ Remove
          </button>
        </motion.div>
      ))}
    </div>
  );
}

const styles = {
  garden: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "1rem",
    paddingTop: "1rem",
  },
  plot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0.5rem",
    borderRadius: "0.75rem",
    backgroundImage: "url('https://www.transparenttextures.com/patterns/soil.png')",
    backgroundColor: "#4b3f2f",
    backgroundSize: "cover",
    backgroundRepeat: "repeat",
    color: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    minHeight: "100px",
    justifyContent: "center",
  },
  plant: {
    fontSize: "2rem",
  },
  label: {
    marginTop: "0.25rem",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  deleteButton: {
    marginTop: "0.25rem",
    fontSize: "0.7rem",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Garden;