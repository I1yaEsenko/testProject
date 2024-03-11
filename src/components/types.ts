export type Product = {
  brand: string;
  id: string;
  price: number;
  product: null | string;
};

export type Products = Array<Product>;

export type getIdsParams = {
  limit: number;
  offset: number;
};

export type FilterFields = {
  field: string;
  value: number | string;
};

export type FilteredFields = {
  [key: string]: string | number;
};
