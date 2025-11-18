import React from "react";

const noteSymbols = ["♪", "♫", "♬", "♩"];
const positions = [
  { left: "10%", top: "20%" },
  { left: "80%", top: "30%" },
  { left: "20%", top: "60%" },
  { left: "70%", top: "70%" },
  { left: "40%", top: "15%" },
  { left: "90%", top: "80%" },
];

const FloatingMusicNotes: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0 select-none">
      {positions.map((pos, i) => (
        <span
          key={i}
          className="absolute text-4xl animate-float pointer-events-auto transition-all duration-300 text-primary opacity-20 hover:opacity-40 hover:scale-110"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: `${i}s`,
          }}
        >
          {noteSymbols[i % noteSymbols.length]}
        </span>
      ))}
    </div>
  );
};

export default FloatingMusicNotes;
