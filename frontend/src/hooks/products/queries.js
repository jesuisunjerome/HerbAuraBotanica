import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";
import { axiosInstance } from "../../lib/axios";
import {
  getFirstAndLastDayOfMonth,
  getMinAndMaxDates,
  updateSearchParams,
} from "../../lib/helper";
import { useCartStore } from "../../store/useCartStore";
import { useDebounce } from "../useDebounce";

//#region ADMIN HOOKS
// Hook para filtrar el dashboard por rango de fechas
export const useFilterDashboard = () => {
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth(
    new Date().getFullYear(),
    new Date().getMonth(),
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [dateFilter, setDateFilter] = useState({
    from: searchParams.get("from") || firstDay.toISOString().split("T")[0],
    to: searchParams.get("to") || lastDay.toISOString().split("T")[0],
  });

  const { minDate, maxDate } = getMinAndMaxDates([
    dateFilter.from,
    dateFilter.to,
  ]);

  // Validar si el rango de fechas es correcto
  useEffect(() => {
    if (new Date(dateFilter.from) > new Date(dateFilter.to)) {
      toast.error("El rango de fechas no es válido");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDateFilter((prev) => ({ ...prev, to: prev.from }));
    }
  }, [dateFilter]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    setDateFilter((prev) => ({ ...prev, [name]: value }));
    updateSearchParams(name, value, searchParams, setSearchParams);
  };

  return {
    from: dateFilter.from,
    to: dateFilter.to,
    minDate,
    maxDate,
    handleDateChange,
  };
};
export const PRODUCTS_KEY = "products";
export const LOW_STOCK_PRODUCTS_KEY = "low-stock-products";
export const INVENTORY_SUMMARY_KEY = "inventory-summary";
export const INVENTORY_HISTORY_KEY = "inventory-history";
export const SALES_REPORT_KEY = "sales-report";
export const INVENTORY_MOVEMENTS_REPORT_KEY = "inventory-movements-report";

// Hook para obtener todos los productos
export const useFetchProducts = ({ page = 1, limit = 10, search = "", refetchInterval } = {}) => {
  const {
    isPending,
    data,
    refetch,
  } = useQuery({
    queryKey: [PRODUCTS_KEY, page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get("/products", { params: { page, limit, search } });
      return response.data;
    },
    refetchInterval,
  });

  return {
    isPending,
    products: data?.data || [],
    pagination: { total: data?.total, page: data?.page, pages: data?.pages },
    refetch,
  };
};

export const useLowStockProducts = () => {
  const {
    data: lowStockProducts,
    isPending,
    refetch,
  } = useQuery({
    queryKey: [LOW_STOCK_PRODUCTS_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get("/inventory/low-stock");
      return response.data;
    },
    refetchInterval: 15000,
  });

  return { lowStockProducts, isPending, refetch };
};

export const useInventorySummary = () => {
  const {
    data: summary,
    isPending,
    refetch,
  } = useQuery({
    queryKey: [INVENTORY_SUMMARY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get("/inventory/summary");
      return response.data;
    },
    refetchInterval: 30000,
  });

  return { summary, isPending, refetch };
};

export const useInventoryHistory = (
  productId,
  { page = 1, limit = 20 } = {},
) => {
  const {
    data: history,
    isPending,
    refetch,
  } = useQuery({
    queryKey: [INVENTORY_HISTORY_KEY, productId || "all", page, limit],
    queryFn: async () => {
      const url = productId
        ? `/inventory/history/${productId}`
        : "/inventory/history";
      const response = await axiosInstance.get(url, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!productId,
  });

  return { history, isPending, refetch };
};

export const useSalesReport = ({
  from,
  to,
  page = 1,
  limit = 10,
  search = "",
}) => {
  const {
    data: salesReport,
    isPending: isLoadingSalesReport,
    refetch,
  } = useQuery({
    queryKey: [
      SALES_REPORT_KEY,
      from,
      to,
      page,
      limit,
      search,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get("/reports/sales", {
        params: {
          from,
          to,
          page,
          limit,
          search,
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return { salesReport, isLoadingSalesReport, refetch };
};

export const useInventoryMovementsReport = ({
  from,
  to,
  page = 1,
  limit = 20,
  search = ""
}) => {
  const {
    data: inventoryMovements,
    isPending: isLoadingInventoryMovements,
    refetch,
  } = useQuery({
    queryKey: [
      INVENTORY_MOVEMENTS_REPORT_KEY,
      from,
      to,
      page,
      limit,
      search,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get("/reports/movements", {
        params: {
          from,
          to,
          page,
          limit,
          search,
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return { inventoryMovements, isLoadingInventoryMovements, refetch };
};
//#endregion

// Hook para renderizar el catálogo de productos con búsqueda y ordenamiento
export const useRenderCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get("sortBy") || "",
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useFetchActiveProducts({ search: debouncedSearchTerm, sortBy: sortOption, limit: 10 });

  const filteredProducts = data?.pages.flatMap((page) => page.data) || [];

  const { addToCart } = useCartStore();
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    updateSearchParams("search", e.target.value, searchParams, setSearchParams);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    updateSearchParams("sortBy", e.target.value, searchParams, setSearchParams);
  };

  return {
    isPending,
    filteredProducts,
    searchTerm,
    sortOption,
    handleSearchChange,
    handleSortChange,
    handleAddToCart,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

// Hook para obtener productos activos
export const useFetchActiveProducts = ({ search = "", sortBy = "", limit = 10, enabled = true } = {}) => {
  const {
    isPending,
    data,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["active-products", { search, sortBy, limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get("/products/active", {
        params: { search, sortBy, page: pageParam, limit },
      });
      return response.data; // { data, total, page, pages }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled,
  });

  if (error)
    toast.error(
      error.response?.data?.message || "Error al cargar los productos",
    );

  return {
    isPending,
    data,
    products: data?.pages.flatMap(page => page.data) || [],
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

// Hook para obtener los productos más vendidos
export const useFetchBestSellers = () => {
  const {
    isPending,
    data: bestSellers,
    error,
    refetch,
  } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products/best-sellers");
      return response.data;
    },
  });

  if (error)
    toast.error(
      error.response?.data?.message || "Error al cargar los productos",
    );

  return { isPending, bestSellers, refetch };
};

// Hook para obtener los nuevos productos
export const useFetchNewArrivals = () => {
  const {
    isPending,
    data: newProducts,
    error,
    refetch,
  } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products/new-arrivals");
      return response.data;
    },
  });

  if (error)
    toast.error(
      error.response?.data?.message || "Error al cargar los productos",
    );

  return { isPending, newProducts, refetch };
};

// Hook para obtener productos similares
export const useFetchSimilarProducts = (productId) => {
  const {
    isPending,
    data: similarProducts,
    error,
    refetch,
  } = useQuery({
    queryKey: ["similar-products", productId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/products/${productId}/similar`,
      );
      return response.data;
    },
    enabled: !!productId,
  });

  if (error)
    toast.error(
      error.response?.data?.message ||
      "Error al cargar los productos similares",
    );

  return { isPending, similarProducts, refetch };
};

// Hook para obtener un producto por ID
export const useFetchProductById = (productId) => {
  const {
    isPending,
    data: product,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });

  return { isPending, product, refetch };
};
