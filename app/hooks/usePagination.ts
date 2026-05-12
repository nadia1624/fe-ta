import { useState, useEffect } from 'react';

export function usePagination<T>(data: T[], itemsPerPage: number = 15, resetTriggers: any[] = []) {
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-reset page to 1 when search or filter values change
  useEffect(() => {
    setCurrentPage(1);
  }, resetTriggers);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedData = data.slice(startIdx, endIdx);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    paginatedData,
    itemsPerPage,
  };
}
