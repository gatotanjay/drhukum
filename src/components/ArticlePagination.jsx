import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

// Menghasilkan daftar nomor halaman dengan "..." untuk halaman yang di-skip,
// selalu menampilkan halaman pertama, terakhir, dan tetangga dari halaman aktif.
const getPageNumbers = (current, total) => {
  const delta = 1;
  const pages = [];

  for (let i = 1; i <= total; i++) {
    const isEdge = i === 1 || i === total;
    const isNearCurrent = i >= current - delta && i <= current + delta;

    if (isEdge || isNearCurrent) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return pages;
};

/**
 * Pagination untuk daftar artikel/blog.
 * Props:
 * - currentPage: halaman aktif (mulai dari 1)
 * - totalPages: total jumlah halaman
 * - onPageChange: (page:number) => void
 * - scrollTargetRef: opsional, ref elemen untuk di-scroll ke atas saat ganti halaman
 */
const ArticlePagination = ({ currentPage, totalPages, onPageChange, scrollTargetRef }) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollTargetRef?.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav aria-label={t('pagination.page', { current: currentPage, total: totalPages })}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goTo(currentPage - 1);
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-40' : ''}
              aria-disabled={currentPage === 1}
            >
              {t('pagination.previous')}
            </PaginationPrevious>
          </PaginationItem>

          {pages.map((page, idx) =>
            page === '...' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goTo(currentPage + 1);
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}
              aria-disabled={currentPage === totalPages}
            >
              {t('pagination.next')}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-sm text-gray-500 mt-3">
        {t('pagination.page', { current: currentPage, total: totalPages })}
      </p>
    </nav>
  );
};

export default ArticlePagination;
