import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useCreateProduct = () => {
  const { isPending, mutate: createProduct } = useMutation({
    mutationFn: async (newProduct) => {
      const response = await axiosInstance.post("/products", newProduct);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Producto creado con éxito");
    },
    onError: (error) => {
      toast.error(
        `${error.response?.data?.message}` || "Error al crear el producto",
      );
    },
  });

  return { isPending, createProduct };
};
