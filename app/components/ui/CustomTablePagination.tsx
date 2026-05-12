import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface CustomTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function CustomTablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: CustomTablePaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  // Smart page visible numbers generator (max 5 buttons visible)
  const getPageNumbers = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const half = Math.floor(maxVisible / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start <= 1) {
      start = 1;
      end = maxVisible;
    } else if (end >= totalPages) {
      end = totalPages;
      start = totalPages - maxVisible + 1;
    }

    const pagesList = [];
    for (let i = start; i <= end; i++) {
      pagesList.push(i);
    }
    return pagesList;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-100">
      <div className="text-xs font-semibold text-gray-500">
        Menampilkan <span className="text-gray-900">{startIdx}</span> hingga{" "}
        <span className="text-gray-900">{endIdx}</span> dari{" "}
        <span className="text-gray-900">{totalItems}</span> data
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-3 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-xs font-bold transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Sebelumnya
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                currentPage === p
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "text-gray-700 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-3 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-xs font-bold transition-all"
        >
          Selanjutnya
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
