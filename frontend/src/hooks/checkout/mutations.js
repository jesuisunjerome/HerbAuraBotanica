import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useCreateCheckoutSession = () => {
  const [checkoutId, setCheckoutId] = useState(null);

  const { isPending: isCreatingSession, mutate: createCheckoutSession } =
    useMutation({
      mutationFn: async (checkoutData) => {
        const response = await axiosInstance.post("/checkout", checkoutData);
        return response.data;
      },
      onSuccess: (data) => {
        setCheckoutId(data._id);
      },
      onError: (error) => {
        toast.error(
          `${error.response?.data?.message}` ||
            "Error al crear la sesión de checkout",
        );
      },
    });

  return { isCreatingSession, createCheckoutSession, checkoutId };
};

export const useUpdateCheckoutPaymentStatus = () => {
  const { isPending: isUpdatingPaymentStatus, mutate: updatePaymentStatus } =
    useMutation({
      mutationFn: async (checkoutData) => {
        const response = await axiosInstance.put(
          `/checkout/${checkoutData.checkoutId}/pay`,
          checkoutData,
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Checkout completado exitosamente");
      },
      onError: (error) => {
        toast.error(
          `${error.response?.data?.message}` ||
            "Error durante el proceso de checkout",
        );
      },
    });

  return { isUpdatingPaymentStatus, updatePaymentStatus };
};

export const useFinalizeCheckoutSession = () => {
  const { isPending: isFinalizing, mutate: finalizeOrder } = useMutation({
    mutationFn: async (checkoutId) => {
      const response = await axiosInstance.post(
        `/checkout/${checkoutId}/finalize`,
        {},
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(
        `${error.response?.data?.message}` || "Error al finalizar el pedido",
      );
    },
  });

  return { isFinalizing, finalizeOrder };
};
