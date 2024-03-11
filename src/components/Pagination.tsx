// @ts-ignore
import s from "../styles/app.module.css";
import { Products } from "../components/types";
import { useEffect, useState } from "react";

export type Pagination = {
  products: Products;
  onDataChange: (displayedProducts: Products) => void;
};
export const Pagination = ({ products, onDataChange }: Pagination) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 50;
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const pages = [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  for (let i = 1; i <= pageCount; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        disabled={currentPage === i}
        className={s.paginationBtn}
      >
        {i}
      </button>,
    );
  }

  useEffect(() => {
    onDataChange(displayedProducts);
  }, [currentPage]);

  return <div className={s.pagination}>{pages}</div>;
};
