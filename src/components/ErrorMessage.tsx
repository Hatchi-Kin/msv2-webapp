import React from "react";

interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[hsl(30,30%,82%)] to-[hsl(30,23%,70%)]">
      <div className="p-8 rounded-2xl backdrop-blur-lg max-w-md text-center bg-background border border-border">
        <p className="text-xl font-bold mb-4 text-primary">{title}</p>
        <p className="text-sm text-foreground opacity-70">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
