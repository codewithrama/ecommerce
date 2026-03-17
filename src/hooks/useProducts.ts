import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/productApi";
import type { Product } from "../types/products";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};
