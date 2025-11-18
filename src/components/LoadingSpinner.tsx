import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-mocha-gradient pt-24">
      <div className="p-8 rounded-2xl backdrop-blur-lg bg-background">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
