import { useState, useMemo, useCallback } from 'react';

/**
 * Configuração do hook de paginação
 */
interface UsePaginationOptions {
  /** Número total de itens */
  totalItems: number;
  /** Itens por página (padrão: 10) */
  pageSize?: number;
  /** Página inicial (padrão: 1) */
  initialPage?: number;
  /** Número de páginas visíveis na navegação (padrão: 5) */
  siblingCount?: number;
}

/**
 * Estado de paginação retornado pelo hook
 */
interface PaginationState {
  /** Página atual */
  currentPage: number;
  /** Total de páginas */
  totalPages: number;
  /** Itens por página */
  pageSize: number;
  /** Total de itens */
  totalItems: number;
  /** Índice do primeiro item da página atual */
  startIndex: number;
  /** Índice do último item da página atual */
  endIndex: number;
  /** Se há página anterior */
  hasPreviousPage: boolean;
  /** Se há próxima página */
  hasNextPage: boolean;
  /** Array de números de página para navegação */
  pageNumbers: (number | 'ellipsis')[];
}

/**
 * Controles de paginação
 */
interface PaginationControls {
  /** Vai para uma página específica */
  goToPage: (page: number) => void;
  /** Vai para a próxima página */
  nextPage: () => void;
  /** Vai para a página anterior */
  previousPage: () => void;
  /** Vai para a primeira página */
  firstPage: () => void;
  /** Vai para a última página */
  lastPage: () => void;
  /** Altera o número de itens por página */
  setPageSize: (size: number) => void;
  /** Reseta para a página inicial */
  reset: () => void;
}

/**
 * Hook para gerenciar paginação de listas.
 * 
 * @example
 * ```tsx
 * const { currentPage, totalPages, goToPage, pageNumbers } = usePagination({
 *   totalItems: 100,
 *   pageSize: 10,
 * });
 * 
 * const paginatedData = data.slice(startIndex, endIndex + 1);
 * ```
 */
export function usePagination(
  options: UsePaginationOptions
): PaginationState & PaginationControls {
  const {
    totalItems,
    pageSize: initialPageSize = 10,
    initialPage = 1,
    siblingCount = 1,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  // Corrige página atual se exceder total
  const safePage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages]
  );

  // Calcula índices
  const startIndex = useMemo(
    () => (safePage - 1) * pageSize,
    [safePage, pageSize]
  );

  const endIndex = useMemo(
    () => Math.min(startIndex + pageSize - 1, totalItems - 1),
    [startIndex, pageSize, totalItems]
  );

  // Gera array de números de página para navegação
  const pageNumbers = useMemo((): (number | 'ellipsis')[] => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + first + last + current
    const totalBlocks = totalNumbers + 2; // + 2 ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(safePage - siblingCount, 1);
    const rightSiblingIndex = Math.min(safePage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, 'ellipsis', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
  }, [safePage, totalPages, siblingCount]);

  // Controles
  const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(newPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSizeState(initialPageSize);
  }, [initialPage, initialPageSize]);

  return {
    currentPage: safePage,
    totalPages,
    pageSize,
    totalItems,
    startIndex,
    endIndex,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
    pageNumbers,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
    reset,
  };
}

/**
 * Hook para fatiar dados baseado na paginação
 */
export function usePaginatedData<T>(
  data: T[],
  options: Omit<UsePaginationOptions, 'totalItems'> = {}
) {
  const pagination = usePagination({
    ...options,
    totalItems: data.length,
  });

  const paginatedData = useMemo(
    () => data.slice(pagination.startIndex, pagination.endIndex + 1),
    [data, pagination.startIndex, pagination.endIndex]
  );

  return {
    ...pagination,
    data: paginatedData,
  };
}
