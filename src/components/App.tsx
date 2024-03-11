import { useEffect, useState } from "react";
import { Product, Products } from "./types";

// @ts-ignore
import s from "../styles/app.module.css";

import { getIds, getProducts } from "../api";
import { Pagination } from "../components/Pagination";
import { Form } from "../components/Form";

export const App = () => {
  const [products, setProducts] = useState<Products>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Products>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDisplayedProductsChange = (newData: Products) => {
    setDisplayedProducts(newData);
  };
  const handleProductsChange = (newData: Products) => {
    setProducts(newData);
  };
  const fetchProducts = async (page: number) => {
    const itemsPerPage = 50;
    let offset = (page - 1) * itemsPerPage;
    const limit = 100;

    const productDetails = [];

    let currentPage = 1;
    let hasMoreProducts = true;

    while (hasMoreProducts) {
      const productIds = await getIds({ limit, offset });
      const products: Products = await getProducts(productIds);
      productDetails.push(...products);

      offset += limit;
      hasMoreProducts = productDetails.length <= 200;

      currentPage++;
    }
    setProducts(productDetails);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return (
    <div>
      <h1 className={s.titleH1}>Список продукции</h1>

      <Form setProducts={handleProductsChange} />

      {isLoading ? (
        <p className={s.loading}>Идет загрузка данных...</p>
      ) : (
        <>
          <div className={s.paginationBlock}>
            <Pagination
              products={products}
              onDataChange={handleDisplayedProductsChange}
            />

            <div className={s.summary}>Всего продуктов: {products.length}</div>
          </div>

          <ul className={s.list}>
            {displayedProducts.map((product: Product) => (
              <li className={s.item} key={product.id}>
                <div className={s.id}>ID: {product.id}</div>
                <div className={s.product}>Продукт: {product.product}</div>
                <div className={s.price}>Цена: {product.price}</div>
                <div className={s.brand}>Бренд: {product.brand}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
