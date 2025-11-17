import { useState, useEffect, useMemo } from "react";
import { PAGINATION } from "@/constants/pagination";

/**
 * Custom hook for pagination logic
 */
export const usePagination = <T>(items: T[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    PAGINATION.DESKTOP_ITEMS_PER_PAGE
  );

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(
        window.innerWidth >= PAGINATION.BREAKPOINT
          ? PAGINATION.DESKTOP_ITEMS_PER_PAGE
          : PAGINATION.MOBILE_ITEMS_PER_PAGE
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    paginatedItems,
    goToPage,
    resetPage,
  };
};
