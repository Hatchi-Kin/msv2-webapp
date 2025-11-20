import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] w-full">
      <div className="flex items-center gap-3 p-6 rounded-2xl bg-background/5 backdrop-blur-sm border border-border/10">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
