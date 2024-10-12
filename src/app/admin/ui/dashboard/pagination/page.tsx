"use client";
/* eslint-disable react/no-unescaped-entities */

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface PaginationProps {
  count: number;
}

const PaginationContent: React.FC<PaginationProps> = ({ count }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const page = searchParams.get("page") || "1";

  const params = new URLSearchParams(searchParams);
  const ITEM_PER_PAGE = 2;

  const hasPrev = ITEM_PER_PAGE * (parseInt(page) - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (parseInt(page) - 1) + ITEM_PER_PAGE < count;

  const handleChangePage = (type: "prev" | "next") => {
    const newPage = type === "prev" ? parseInt(page) - 1 : parseInt(page) + 1;
    params.set("page", newPage.toString());
    replace(`${pathname}?${params}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: hasPrev ? '#5d57c9' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: hasPrev ? 'pointer' : 'not-allowed'
        }}
        disabled={!hasPrev}
        onClick={() => handleChangePage("prev")}
      >
        Previous
      </button>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: hasNext ? '#5d57c9' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: hasNext ? 'pointer' : 'not-allowed'
        }}
        disabled={!hasNext}
        onClick={() => handleChangePage("next")}
      >
        Next
      </button>
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaginationContent {...props} />
    </Suspense>
  );
};

export default Pagination;
