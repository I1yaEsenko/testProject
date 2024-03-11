import md5 from "md5";
import { getIdsParams } from "../components/types";

const HTTP_LINK = "https://api.valantis.store:41000/";
const PASSWORD = "Valantis";

export const authString = md5(
  `${PASSWORD}_${new Date().toISOString().split("T")[0].replace(/-/g, "")}`,
);

export async function getIds({ limit, offset }: getIdsParams) {
  const response = await fetch(HTTP_LINK, {
    body: JSON.stringify({
      action: "get_ids",
      params: {
        limit,
        offset,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Auth": authString,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Ошибка сети");
  }

  const data = await response.json();

  return data.result;
}

export async function getProducts(ids: Array<string>) {
  const response = await fetch(HTTP_LINK, {
    body: JSON.stringify({
      action: "get_items",
      params: {
        ids: ids,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Auth": authString,
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorId = response.headers.get("X-Error-Id");
    console.error("Ошибка API:", errorId);

    return getProducts(ids);
  }
  const data = await response.json();
  const totalProducts = data.result;

  const uniqueProducts = [];
  const uniqueProductIds = new Set();

  for (const product of totalProducts) {
    if (!uniqueProductIds.has(product.id)) {
      uniqueProductIds.add(product.id);
      uniqueProducts.push(product);
    }
  }

  return uniqueProducts;
}

export async function getFields(
  field?: null | number | string,
  limit?: number,
  offset?: number,
) {
  field = field || "id";
  limit = limit || 10;
  offset = offset || 50;

  const response = await fetch(HTTP_LINK, {
    body: JSON.stringify({
      action: "get_fields",
      params: {
        field,
        limit,
        offset,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Auth": authString,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Ошибка сети");
  }
  const data = await response.json();
  const res = data.result;

  if (!Array.isArray(res)) {
    throw new Error("Некорректный формат данных");
  }
  if (!field) {
    const filteredValues = Object.values(res)
      .filter((value) => value !== null)
      .sort((a, b) => a - b);

    return filteredValues;
  } else {
    const fieldValues = res
      .filter((value) => value !== null)
      .sort((a, b) =>
        typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a).localeCompare(String(b)),
      );

    console.log(fieldValues);

    return fieldValues;
  }
}

export async function filterProducts(field: string, value: string | number) {
  const response = await fetch(HTTP_LINK, {
    body: JSON.stringify({
      action: "filter",
      params: {
        [field]: value,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Auth": authString,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Ошибка сети");
  }
  const data = await response.json();
  const res = data.result;

  console.log(res);

  return res;
}
