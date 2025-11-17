import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  loadingText,
  children,
}) => {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full h-12 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 mt-6 bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
