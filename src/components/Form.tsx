import React, { useState } from "react";
import { FilteredFields, Products } from "../components/types";
import { filterProducts, getProducts } from "../api";
// @ts-ignore
import s from "../styles/app.module.css";

type Form = {
  setProducts: (newData: Products) => void;
};

export const Form = ({ setProducts }: Form) => {
  const [filterData, setFilterData] = useState({
    product: "",
    price: 0,
    brand: "",
  });
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilterData((prevFilterData) => ({
      ...prevFilterData,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleFilterFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const filteredFields: FilteredFields = Object.entries(filterData)
        // @ts-ignore
        .filter(([key, value]) => value !== "")
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      for (const [key, value] of Object.entries(filteredFields)) {
        try {
          const filteredIds = await filterProducts(key, value);
          const products = await getProducts(filteredIds);

          setProducts(products);
        } catch (error) {
          console.error("Ошибка фильтрации:", error);
        }
      }
    } catch (error) {
      console.error("Ошибка фильтрации:", error);
    }
  };

  return (
    <form onSubmit={handleFilterFormSubmit}>
      <label>
        Продукт:
        <input
          name={"product"}
          onChange={handleFilterChange}
          type={"text"}
          id={"product"}
          className={s.formInput}
        />
      </label>
      <label>
        Цена:
        <input
          name={"price"}
          onChange={handleFilterChange}
          type={"number"}
          id={"price"}
          className={s.formInput}
        />
      </label>
      <label>
        Бренд:
        <input
          name={"brand"}
          onChange={handleFilterChange}
          type={"text"}
          id={"brand"}
          className={s.formInput}
        />
      </label>
      <button type={"submit"} className={s.formBtn}>
        Фильтрация
      </button>
    </form>
  );
};
