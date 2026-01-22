import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";
import { axiosInstance } from "../../lib/axios";
import { useCartStore } from "../../store/useCartStore";

export const useRenderCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");

  const { isPending, products } = useFetchActiveProducts();

  const filteredProducts = Array.isArray(products)
    ? products
        ?.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price?.toString().includes(searchTerm) ||
            product.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
        ?.sort((a, b) => {
          if (sortOption === "price-low-high") {
            return parseFloat(a.price) - parseFloat(b.price);
          } else if (sortOption === "price-high-low") {
            return parseFloat(b.price) - parseFloat(a.price);
          } else if (sortOption === "newest") {
            return b.createdAt.localeCompare(a.createdAt);
          }
          return 0;
        })
    : [];

  const { addToCart } = useCartStore();
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const updateSearchParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    updateSearchParams("search", e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    updateSearchParams("sort", e.target.value);
  };

  return {
    isPending,
    filteredProducts,
    searchTerm,
    sortOption,
    handleSearchChange,
    handleSortChange,
    handleAddToCart,
  };
};

export const useFetchProducts = () => {
  const {
    isPending,
    data: products,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products");
      return response.data;
    },
  });

  return { isPending, products, refetch };
};

export const useFetchActiveProducts = () => {
  const {
    isPending,
    data: products,
    error,
    refetch,
  } = useQuery({
    queryKey: ["active-products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products/active");
      return response.data;
    },
  });

  if (error)
    toast.error(
      error.response?.data?.message || "Error al cargar los productos",
    );

  return { isPending, products, refetch };
};

export const useFetchProductById = (productId) => {
  const {
    isPending,
    data: product,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });

  if (error)
    toast.error(error.response?.data?.message || "Error al cargar el producto");

  return { isPending, product, refetch };
};
