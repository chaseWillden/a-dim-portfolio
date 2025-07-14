import { useState, useEffect } from "react";

interface SaveIndicatorProps {
  onResetGame: () => void;
}

export const SaveIndicator = ({ onResetGame }: SaveIndicatorProps) => {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    // Show "Saved" indicator briefly whenever the component re-renders
    // (which happens when game state changes and saves)
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1000,
      }}
    >
      {showSaved && (
        <div
          style={{
            backgroundColor: "#0f0",
            color: "#000",
            padding: "5px 10px",
            borderRadius: "3px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Saved
        </div>
      )}

      <button
        onClick={onResetGame}
        style={{
          backgroundColor: "#600",
          color: "#fff",
          border: "1px solid #800",
          padding: "5px 10px",
          cursor: "pointer",
          fontSize: "12px",
          borderRadius: "3px",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#800")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#600")}
      >
        Reset Game
      </button>
    </div>
  );
};
