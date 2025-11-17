import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string; // e.g., "artists", "tracks"
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 gap-4 border-t border-border">
      <p className="text-sm text-foreground opacity-70">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
        {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border border-border bg-background text-primary"
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let page: number;
            if (totalPages <= 7) {
              page = i + 1;
            } else if (currentPage <= 4) {
              page = i + 1;
            } else if (currentPage >= totalPages - 3) {
              page = totalPages - 6 + i;
            } else {
              page = currentPage - 3 + i;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 text-sm border ${
                  page === currentPage
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-primary border-border"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border border-border bg-background text-primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
