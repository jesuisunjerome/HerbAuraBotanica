import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
export const ORDER_KEY = "orders";

export const useGetAllOrders = ({ page = 1, limit = 10, search = "" } = {}) => {
  const { isPending, data } = useQuery({
    queryKey: [ORDER_KEY, page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get("/orders", { params: { page, limit, search } });
      return response.data;
    },
  });

  return {
    isPending,
    orders: data?.data || [],
    pagination: { total: data?.total, page: data?.page, pages: data?.pages },
  };
};

export const usePendingOrdersCount = () => {
  const { isPending, data } = useQuery({
    queryKey: [ORDER_KEY, "pending", "count"],
    queryFn: async () => {
      const response = await axiosInstance.get("/orders/pending/count");
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep sidebar up to date
  });

  return {
    isPending,
    count: data?.count || 0,
  };
};

export const useGetOrderById = (orderId) => {
  const {
    isPending,
    data: order,
    error,
  } = useQuery({
    queryKey: [ORDER_KEY, orderId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });

  return { isPending, order, error };
};

export const useGetOrderByConfirmationNumber = (confirmationNumber) => {
  const { isPending, data: order } = useQuery({
    queryKey: [ORDER_KEY, "confirmationNumber", confirmationNumber],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/orders/confirmation/${confirmationNumber}`,
      );
      return response.data;
    },
    enabled: !!confirmationNumber,
  });

  return { isPending, order };
};
