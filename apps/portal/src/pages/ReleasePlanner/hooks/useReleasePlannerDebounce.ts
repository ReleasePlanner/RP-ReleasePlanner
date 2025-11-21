import { useEffect } from "react";

interface UseReleasePlannerDebounceProps {
  searchQuery: string;
  setDebouncedSearchQuery: (query: string) => void;
}

/**
 * Hook for debouncing search query
 */
export function useReleasePlannerDebounce({
  searchQuery,
  setDebouncedSearchQuery,
}: UseReleasePlannerDebounceProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setDebouncedSearchQuery]);
}

