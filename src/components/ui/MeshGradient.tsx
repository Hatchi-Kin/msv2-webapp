import React from "react";

const MeshGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mesh-gradient-bg">
      {/* Animated blobs for extra depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] animate-float" style={{ animationDuration: '15s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px] animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-[80px] animate-float" style={{ animationDuration: '25s', animationDelay: '5s' }} />
    </div>
  );
};

export default MeshGradient;
