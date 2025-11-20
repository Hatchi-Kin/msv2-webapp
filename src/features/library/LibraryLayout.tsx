import React from "react";
import { Outlet } from "react-router-dom";

const LibraryLayout: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default LibraryLayout;
