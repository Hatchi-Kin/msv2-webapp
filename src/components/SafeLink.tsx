import React from 'react';
import { getSafeUrl } from '@/utils/security';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  showIcon?: boolean;
  confirmExternal?: boolean;
}

/**
 * A secure link component that validates the destination URL using getSafeUrl.
 * Adds noopener noreferrer for external links and optional confirmation dialog.
 */
export const SafeLink: React.FC<SafeLinkProps> = ({
  href,
  children,
  showIcon = false,
  confirmExternal = false,
  onClick,
  className,
  ...props
}) => {
  const safeHref = getSafeUrl(href);
  // Determine if it's external (starts with http/https)
  const isExternal = safeHref ? /^https?:\/\//i.test(safeHref) : false;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (confirmExternal && isExternal) {
      if (!window.confirm(`You are about to leave the application to visit:\n\n${safeHref}\n\nDo you want to proceed?`)) {
        e.preventDefault();
        return;
      }
    }
    if (onClick) onClick(e);
  };

  if (!safeHref) {
    // If unsafe, render as a warning
    console.warn(`Blocked unsafe URL: ${href}`);
    return (
      <span 
        className={`inline-flex items-center gap-1 text-destructive cursor-not-allowed ${className || ''}`} 
        title="Blocked unsafe URL"
      >
        <AlertTriangle size={14} />
        {children}
      </span>
    );
  }

  return (
    <a
      href={safeHref}
      onClick={handleClick}
      // Security best practice for external links
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : props.target}
      className={`inline-flex items-center gap-1 hover:text-primary transition-colors ${className || ''}`}
      {...props}
    >
      {children}
      {showIcon && isExternal && <ExternalLink size={14} className="ml-0.5 opacity-70" />}
    </a>
  );
};
