import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export const useGetAllOrders = () => {
  const { isPending, data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axiosInstance.get("/orders");
      return response.data;
    },
  });

  return { isPending, orders };
};

export const useGetOrderById = (orderId) => {
  const { isPending, data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });

  return { isPending, order };
};
