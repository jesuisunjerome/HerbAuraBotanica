import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
export const ORDER_KEY = "orders";

export const useGetAllOrders = () => {
  const { isPending, data: orders } = useQuery({
    queryKey: [ORDER_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get("/orders");
      return response.data;
    },
  });

  return { isPending, orders };
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
