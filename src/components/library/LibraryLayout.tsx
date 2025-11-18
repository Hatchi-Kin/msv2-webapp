import React from "react";
import { Outlet } from "react-router-dom";
import FloatingMusicNotes from "@/components/FloatingMusicNotes";

const LibraryLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <FloatingMusicNotes />
      <div className="container max-w-6xl mx-auto p-6 space-y-6 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default LibraryLayout;
