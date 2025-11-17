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

      <span className="absolute left-[5%] top-[40%] text-3xl animate-float note-hover-0 pointer-events-auto transition-all duration-300" style={{ animationDelay: '1.5s', color: '#8B5E3C', opacity: 0.15, userSelect: 'none' }}>♬</span>
      <span className="absolute left-[50%] top-[50%] text-5xl animate-float note-hover-1 pointer-events-auto transition-all duration-300" style={{ animationDelay: '2.5s', color: '#CE9A6A', opacity: 0.12, userSelect: 'none' }}>♪</span>
      <span className="absolute left-[85%] top-[15%] text-3xl animate-float note-hover-2 pointer-events-auto transition-all duration-300" style={{ animationDelay: '3.5s', color: '#8B5E3C', opacity: 0.18, userSelect: 'none' }}>♩</span>
      <span className="absolute left-[30%] top-[85%] text-4xl animate-float note-hover-3 pointer-events-auto transition-all duration-300" style={{ animationDelay: '4.5s', color: '#CE9A6A', opacity: 0.16, userSelect: 'none' }}>♫</span>
      <span className="absolute left-[65%] top-[45%] text-3xl animate-float note-hover-4 pointer-events-auto transition-all duration-300" style={{ animationDelay: '5.5s', color: '#8B5E3C', opacity: 0.14, userSelect: 'none' }}>♪</span>
      <span className="absolute left-[25%] top-[35%] text-4xl animate-float note-hover-5 pointer-events-auto transition-all duration-300" style={{ animationDelay: '6.5s', color: '#CE9A6A', opacity: 0.17, userSelect: 'none' }}>♬</span>
      <span className="absolute left-[95%] top-[55%] text-3xl animate-float note-hover-6 pointer-events-auto transition-all duration-300" style={{ animationDelay: '7.5s', color: '#8B5E3C', opacity: 0.13, userSelect: 'none' }}>♫</span>
      <span className="absolute left-[45%] top-[75%] text-5xl animate-float note-hover-7 pointer-events-auto transition-all duration-300" style={{ animationDelay: '0.5s', color: '#CE9A6A', opacity: 0.11, userSelect: 'none' }}>♩</span>
      <span className="absolute left-[75%] top-[25%] text-3xl animate-float note-hover-0 pointer-events-auto transition-all duration-300" style={{ animationDelay: '1.8s', color: '#8B5E3C', opacity: 0.19, userSelect: 'none' }}>♪</span>
      <span className="absolute left-[12%] top-[50%] text-4xl animate-float note-hover-1 pointer-events-auto transition-all duration-300" style={{ animationDelay: '2.8s', color: '#CE9A6A', opacity: 0.14, userSelect: 'none' }}>♬</span>
      <span className="absolute left-[55%] top-[90%] text-3xl animate-float note-hover-2 pointer-events-auto transition-all duration-300" style={{ animationDelay: '3.8s', color: '#8B5E3C', opacity: 0.16, userSelect: 'none' }}>♫</span>
      <span className="absolute left-[88%] top-[65%] text-4xl animate-float note-hover-3 pointer-events-auto transition-all duration-300" style={{ animationDelay: '4.8s', color: '#CE9A6A', opacity: 0.15, userSelect: 'none' }}>♩</span>
    </div>
  );
};

export default FloatingMusicNotes;
