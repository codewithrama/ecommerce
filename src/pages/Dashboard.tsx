import { useProducts } from "../hooks/useProducts";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { searchProducts, fetchCategories } from "../services/productApi";
import type { Category, Product } from "../types/products";

const Dashboard = () => {
  const { data, isLoading, error } = useProducts();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  //  Search API
  const { data: searchData, isFetching } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: !!debouncedSearch,
  });

  // Categories API
  const { data: categoriesList } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  //  Decide base data
  let productsToShow = debouncedSearch && searchData ? searchData : data;

  //  Apply category filter
  if (selectedCategory) {
    productsToShow = productsToShow?.filter(
      (p) => p.category === selectedCategory,
    );
  }

  if (isLoading)
    return <p className="p-6 text-gray-500">Loading products...</p>;

  if (error) return <p className="p-6 text-red-500">Something went wrong</p>;

  const totalProducts = data?.length || 0;

  const avgPrice =
    totalProducts > 0
      ? (data?.reduce((acc, item) => acc + item.price, 0) ?? 0) / totalProducts
      : 0;

  const categoriesCount = new Set(data?.map((p) => p.category)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10 space-y-8">
      {/* Header + Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Inventory Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Manage and monitor your products</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/*  Search */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {isFetching && (
              <p className="text-xs text-gray-400">Searching...</p>
            )}
          </div>

          {/*  Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-52 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none"
          >
            <option value="">All Categories</option>

            {categoriesList?.map((cat: Category) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Products", value: totalProducts },
          { title: "Average Price", value: `₹${avgPrice.toFixed(2)}` },
          { title: "Categories", value: categoriesCount },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsToShow?.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="group cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition duration-300 border border-gray-100"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="mt-3 space-y-1">
              <h2 className="font-semibold text-gray-800 line-clamp-1">
                {product.title}
              </h2>

              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {product.category}
              </p>

              <p className="text-lg font-bold text-gray-900 mt-1">
                ₹{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {productsToShow?.length === 0 && (
        <p className="text-gray-500 text-center mt-6">No products found</p>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl">
            {/* Close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={selectedProduct.thumbnail}
              alt={selectedProduct.title}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />

            {/* Content */}
            <h2 className="text-xl font-bold text-gray-800">
              {selectedProduct.title}
            </h2>

            <p className="text-sm text-gray-400 uppercase mt-1">
              {selectedProduct.category}
            </p>

            <p className="text-lg font-semibold text-gray-900 mt-2">
              ₹{selectedProduct.price}
            </p>

            {selectedProduct.description && (
              <p className="text-sm text-gray-600 mt-3">
                {selectedProduct.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
