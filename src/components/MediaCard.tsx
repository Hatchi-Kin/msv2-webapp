import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MediaCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

/**
 * Generic card component for artists, albums, etc.
 */
const MediaCard: React.FC<MediaCardProps> = ({ title, icon, onClick }) => {
  return (
    <Card
      className="group cursor-pointer glass-card rounded-3xl"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3 flex flex-col min-h-[140px]">
        <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto transition-all duration-300 bg-muted">
          {icon}
        </div>
        <div className="text-center flex-1 flex items-center justify-center min-h-[40px]">
          <p className="font-medium text-sm leading-tight line-clamp-2 text-foreground">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
