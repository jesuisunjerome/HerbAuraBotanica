import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import {
  INVENTORY_HISTORY_KEY,
  INVENTORY_SUMMARY_KEY,
  LOW_STOCK_PRODUCTS_KEY,
  PRODUCTS_KEY,
} from "./queries";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createProduct } = useMutation({
    mutationFn: async (newProduct) => {
      toast.loading("Guardando...", { id: "createProduct" });
      const response = await axiosInstance.post("/products", newProduct);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success("Producto creado con éxito");
    },
    onError: (error) => {
      toast.error(
        `${error.response?.data?.message}` || "Error al crear el producto",
      );
    },
    onSettled: () => {
      toast.dismiss("createProduct");
    },
  });

  return { isCreating, createProduct };
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateProduct } = useMutation({
    mutationFn: async ({ productId, updatedProduct }) => {
      toast.loading("Actualizando...", { id: "updateProduct" });
      const response = await axiosInstance.put(
        `/products/${productId}`,
        updatedProduct,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success("Producto actualizado con éxito");
    },
    onError: (error) => {
      toast.error(
        `${error.response?.data?.message}` || "Error al actualizar el producto",
      );
    },
    onSettled: () => {
      toast.dismiss("updateProduct");
    },
  });

  return { isUpdating, updateProduct };
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  const { isPending: isUpdatingStatus, mutate: updateProductStatus } =
    useMutation({
      mutationFn: async (productId) => {
        toast.loading("Actualizando...", { id: "updateProductStatus" });
        const response = await axiosInstance.patch(
          `/products/${productId}/status`,
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        toast.success("Estado del producto actualizado con éxito");
      },
      onError: (error) => {
        toast.error(
          `${error.response?.data?.message}` ||
            "Error al actualizar el estado del producto",
        );
      },
      onSettled: () => {
        toast.dismiss("updateProductStatus");
      },
    });

  return { isUpdatingStatus, updateProductStatus };
};

export const useAdjustProductStock = () => {
  const queryClient = useQueryClient();

  const { isPending: isAdjustingStock, mutate: adjustProductStock } =
    useMutation({
      mutationFn: async ({ productId, movementType, quantity, reason }) => {
        toast.loading("Ajustando inventario...", { id: "adjustProductStock" });
        const response = await axiosInstance.post(
          `/inventory/${productId}/adjust`,
          {
            movementType,
            quantity,
            reason,
          },
        );

        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        queryClient.invalidateQueries({ queryKey: [LOW_STOCK_PRODUCTS_KEY] });
        queryClient.invalidateQueries({ queryKey: [INVENTORY_SUMMARY_KEY] });
        queryClient.invalidateQueries({ queryKey: [INVENTORY_HISTORY_KEY] });
        toast.success("Inventario actualizado con éxito");
      },
      onError: (error) => {
        toast.error(
          `${error.response?.data?.message}` ||
            "Error al actualizar el inventario",
        );
      },
      onSettled: () => {
        toast.dismiss("adjustProductStock");
      },
    });

  return { isAdjustingStock, adjustProductStock };
};
