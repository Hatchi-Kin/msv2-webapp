import React from 'react';

const FloatingMusicNotes: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0 select-none">
      <span className="absolute left-[10%] top-[20%] text-4xl animate-float note-hover-0 pointer-events-auto transition-all duration-300" style={{ animationDelay: '0s', color: '#8B5E3C', opacity: 0.2, userSelect: 'none' }}>♪</span>
      <span className="absolute left-[80%] top-[30%] text-4xl animate-float note-hover-1 pointer-events-auto transition-all duration-300" style={{ animationDelay: '1s', color: '#8B5E3C', opacity: 0.2, userSelect: 'none' }}>♫</span>
      <span className="absolute left-[20%] top-[60%] text-4xl animate-float note-hover-2 pointer-events-auto transition-all duration-300" style={{ animationDelay: '2s', color: '#8B5E3C', opacity: 0.2, userSelect: 'none' }}>♪</span>
      <span className="absolute left-[70%] top-[70%] text-4xl animate-float note-hover-3 pointer-events-auto transition-all duration-300" style={{ animationDelay: '3s', color: '#8B5E3C', opacity: 0.2, userSelect: 'none' }}>♫</span>
      <span className="absolute left-[40%] top-[15%] text-4xl animate-float note-hover-4 pointer-events-auto transition-all duration-300" style={{ animationDelay: '4s', color: '#8B5E3C', opacity: 0.2, userSelect: 'none' }}>♪</span>
      <span className="absolute left-[90%] top-[80%] text-4xl animate-float note-hover-5 pointer-events-auto transition-all duration-300" style={{ animationDelay: '5s', color: '#8B5E3C', opacity: 0.2, userSelect: 'none' }}>♫</span>
      <span className="absolute left-[15%] top-[80%] text-3xl animate-float note-hover-6 pointer-events-auto transition-all duration-300" style={{ animationDelay: '6s', color: '#CE9A6A', opacity: 0.15, userSelect: 'none' }}>♬</span>
      <span className="absolute left-[60%] top-[10%] text-3xl animate-float note-hover-7 pointer-events-auto transition-all duration-300" style={{ animationDelay: '7s', color: '#CE9A6A', opacity: 0.15, userSelect: 'none' }}>♩</span>
    </div>
  );
};

export default FloatingMusicNotes;
