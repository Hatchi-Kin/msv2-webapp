import React from "react";

interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 glass-panel rounded-3xl border border-destructive/20 bg-destructive/5">
      <div className="p-8 rounded-2xl max-w-md text-center bg-background/50 backdrop-blur-sm border border-border">
        <p className="text-xl font-bold mb-4 text-destructive">{title}</p>
        <p className="text-sm text-foreground opacity-70">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
