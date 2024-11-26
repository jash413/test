import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { MoreHorizontal } from 'lucide-react';

const PaginationComp = ({
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage
}: {
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (pageNumber: number) => void;
}) => {
  const getPages = () => {
    const pages = [];

    // Previous page button
    pages.push(
      <PaginationItem key="previous">
        <PaginationPrevious href="#" onClick={goToPreviousPage} />
      </PaginationItem>
    );

    // Show ellipsis if there are pages before (current - 1)
    if (currentPage > 2) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          {/* <PaginationEllipsis /> */}
          <MoreHorizontal color="#000000aa" size={16} />
        </PaginationItem>
      );
    }

    // Current - 1 page, if applicable
    if (currentPage > 1) {
      pages.push(
        <PaginationItem key={currentPage - 1}>
          <PaginationLink href="#" onClick={() => goToPage(currentPage - 1)}>
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Current page
    pages.push(
      <PaginationItem key={currentPage}>
        <PaginationLink href="#" isActive>
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );

    // Current + 1 page, if applicable
    if (currentPage < totalPages) {
      pages.push(
        <PaginationItem key={currentPage + 1}>
          <PaginationLink href="#" onClick={() => goToPage(currentPage + 1)}>
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if there are pages after (current + 1)
    if (currentPage < totalPages - 1) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          {/* <PaginationEllipsis /> */}
          <MoreHorizontal color="#000000aa" size={16} />
        </PaginationItem>
      );
    }

    // Next page button
    pages.push(
      <PaginationItem key="next">
        <PaginationNext href="#" onClick={goToNextPage} />
      </PaginationItem>
    );

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>{getPages()}</PaginationContent>
    </Pagination>
  );
};

export default PaginationComp;
