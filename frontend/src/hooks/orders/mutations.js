import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useCreateOrder = () => {
  const { isPending: isCreatingOrder, mutateAsync: createOrder } = useMutation({
    mutationFn: async (orderData) => {
      const data = await ORDER_API_CREATE_ORDER(orderData);
      return data;
    },
    onSuccess: (data) => {
      // toast.success("Pedido creado exitosamente");
      return data;
    },
    onError: (error) => {
      toast.error(
        `${error.response?.data?.message}` || "Error al crear el pedido",
      );
    },
  });

  return { isCreatingOrder, createOrder };
};

export const useCaptureOrder = () => {
  const { isPending: isCapturingOrder, mutateAsync: captureOrder } =
    useMutation({
      mutationFn: async ({ orderId, paypalOrderId }) => {
        const response = await axiosInstance.post(`/orders/${orderId}/pay`, {
          paypalOrderId,
        });
        return response.data;
      },
      onSuccess: (data) => {
        // toast.success("Pedido capturado exitosamente");
        return data;
      },
      onError: (error) => {
        toast.error(
          `${error.response?.data?.message}` || "Error al capturar el pedido",
        );
      },
    });

  return { isCapturingOrder, captureOrder };
};

export const ORDER_API_CREATE_ORDER = async (orderData) => {
  try {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
