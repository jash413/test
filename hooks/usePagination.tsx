import { useState, useMemo } from 'react';

// Helper function to get nested object value by string path
const getValueByPath = (obj: any, path: string) => {
  return path
    .split('.')
    .reduce((acc: any, part: string) => acc && acc[part], obj);
};

const usePagination = (data: any[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPath, setSearchPath] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!searchQuery || !searchPath) return data;

    return data.filter((item) => {
      const fieldValue = getValueByPath(item, searchPath);
      return fieldValue
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchPath]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData?.length / itemsPerPage);
  }, [filteredData?.length, itemsPerPage]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData?.slice(startIndex, endIndex);
  }, [currentPage, filteredData, itemsPerPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(() => Math.max(1, Math.min(pageNumber, totalPages)));
  };

  const handleSearch = (query: string, path: string) => {
    setSearchQuery(query);
    setSearchPath(path);
    setCurrentPage(1); // Reset to the first page on search
  };

  return {
    currentPage,
    totalPages,
    currentData,
    searchQuery,
    handleSearch,
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
};

export default usePagination;
