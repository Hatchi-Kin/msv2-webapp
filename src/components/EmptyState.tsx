import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
      <p className="text-sm text-foreground opacity-70">{message}</p>
    </div>
  );
};

export default EmptyState;
