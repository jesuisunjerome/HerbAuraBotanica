import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useCreateProduct = () => {
  const { isPending: isCreating, mutate: createProduct } = useMutation({
    mutationFn: async (newProduct) => {
      const response = await axiosInstance.post("/products", newProduct);
      toast.loading("Guardando...", { duration: 2000 });
      return response.data;
    },
    onSuccess: () => {
      setTimeout(() => {
        toast.success("Producto creado con éxito");
      }, 2000);
    },
    onError: (error) => {
      toast.error(
        `${error.response?.data?.message}` || "Error al crear el producto",
      );
    },
  });

  return { isCreating, createProduct };
};
