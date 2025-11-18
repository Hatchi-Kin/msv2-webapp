import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LibraryHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children?: React.ReactNode;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-6 rounded-2xl backdrop-blur-lg bg-background">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-foreground opacity-70">{subtitle}</p>
        )}
        {children}
      </div>

      {showBack && (
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center space-x-2 border-2 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md border-border bg-background text-primary"
        >
          <span>← Back</span>
        </Button>
      )}
    </div>
  );
};

export default LibraryHeader;
