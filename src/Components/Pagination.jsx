import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DOTS = "...";

/**
 * Hook personalizado para calcular el rango de paginación con lógica de elipsis.
 */
const usePagination = ({ currentPage, totalPages, siblingCount = 1 }) => {
    return React.useMemo(() => {
        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, DOTS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from(
                { length: rightItemCount },
                (_, i) => totalPages - rightItemCount + 1 + i
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }, [currentPage, totalPages, siblingCount]);
};

const Pagination = ({
    onPageChange,
    totalPages,
    currentPage,
    totalItems = 0,
    itemsPerPage = 0,
}) => {
    const paginationRange = usePagination({ currentPage, totalPages });

    if (currentPage === 0 || totalPages < 2) {
        return null;
    }

    const onNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div className="flex justify-between items-center mt-6">
            {/* Info de registros */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando{" "}
                <span className="font-medium">{itemsPerPage}</span> de{" "}
                <span className="font-medium">{totalItems}</span> registros
            </div>

            {/* Controles */}
            <div className="flex space-x-1 sm:space-x-2">
                {/* Prev */}
                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-1 rounded-md transition-colors duration-200 ${currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Números */}
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        return (
                            <span
                                key={`${DOTS}-${index}`}
                                className="px-3 py-1 text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                            className={`px-3 py-1 font-bold rounded-md transition-colors duration-200 ${currentPage === pageNumber
                                    ? "bg-[#C1A35D] text-white shadow-md hover:bg-[#B08968] cursor-pointer"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                                }`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                {/* Next */}
                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-1 rounded-md transition-colors duration-200 ${currentPage === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
