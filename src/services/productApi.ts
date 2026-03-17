import axios from "axios";
import type { Category } from "../types/products";

import type { Product } from "../types/products";

const BASE_URL = "https://dummyjson.com";

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get(`${BASE_URL}/products`);
  return res.data.products;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const res = await axios.get(`${BASE_URL}/products/search?q=${query}`);
  return res.data.products;
};
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get("https://dummyjson.com/products/categories");
  return res.data;
};
