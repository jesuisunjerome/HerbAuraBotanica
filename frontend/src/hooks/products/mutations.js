import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createProduct } = useMutation({
    mutationFn: async (newProduct) => {
      toast.loading("Guardando...", { id: "createProduct" });
      const response = await axiosInstance.post("/products", newProduct);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
        const response = await axiosInstance.put(
          `/products/${productId}/status`,
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
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
