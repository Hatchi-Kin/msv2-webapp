import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  variant?: "error" | "warning" | "info";
}

/**
 * Inline error/warning/info alert component
 * Use for form errors, inline notifications, etc.
 */
const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  variant = "error",
}) => {
  const variantStyles = {
    error: "text-primary bg-muted border-muted-foreground",
    warning: "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800",
    info: "text-foreground bg-muted border-border",
  };

  return (
    <div
      className={`p-4 text-sm rounded-xl flex items-center gap-2 border ${variantStyles[variant]}`}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorAlert;
