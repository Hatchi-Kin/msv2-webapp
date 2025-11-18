import React from "react";
import { Outlet } from "react-router-dom";
import MeshGradient from "@/components/ui/MeshGradient";

const LibraryLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative bg-background text-foreground">
      <MeshGradient />
      <div className="container max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default LibraryLayout;
