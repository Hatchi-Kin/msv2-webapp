import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LibraryHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  children,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-start justify-between p-6 rounded-3xl glass-panel">
      <div className="flex-1 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {children && (
          <div className="pt-2">
            {children}
          </div>
        )}
      </div>

      {showBack && (
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex items-center space-x-2 border-2 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md border-border bg-background text-primary flex-shrink-0"
        >
          <span>← Back</span>
        </Button>
      )}
    </div>
  );
};

export default LibraryHeader;
