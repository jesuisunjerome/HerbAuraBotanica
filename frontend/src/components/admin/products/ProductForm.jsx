import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeftIcon,
  LoaderCircleIcon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../../../hooks/products/mutations";
import { useFetchProductById } from "../../../hooks/products/queries";
import { productSchema } from "../../../lib/schemas";
import GeneralInfoSection from "./GeneralInfoSection";
import ImageUploaderSection from "./ImageUploaderSection";

export default function ProductForm() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const navigate = useNavigate();

  const { isPending, product } = useFetchProductById(productId);
  const { isCreating, createProduct } = useCreateProduct();
  const { isUpdating, updateProduct } = useUpdateProduct();

  // If editing an existing product, verify its state, load its data then populate the form
  const isPendingProduct = isPending && !!productId;

  const [listOfImages, setListOfImages] = useState([]);

  const {
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    clearErrors,
    setError,
    trigger,
  } = useForm({
    values: product,
    resolver: zodResolver(productSchema),
    mode: "all",
  });

  useEffect(() => {
    const updateDataImages = () => {
      const mainImg = listOfImages.find((img) => img.isMain);
      const otherImages = listOfImages.filter((img) => !img.isMain);
      const allImages = mainImg ? [mainImg, ...otherImages] : listOfImages;

      setValue("images", allImages);
      const images = getValues("images");
      if (images && images.length > 1) clearErrors("images");
      else {
        setError("images", {
          type: "manual",
          message: "Se requieren al menos 2 imágenes",
        });
      }
      trigger("images");
    };

    updateDataImages();
  }, [listOfImages, setValue, getValues, clearErrors, trigger, setError]);

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setListOfImages(product.images.sort((a, b) => b.isMain - a.isMain) || []);
    }
  }, [product]);

  const isSaving = isSubmitting || isCreating || isUpdating;
  const onSubmit = (data) => {
    if (product) {
      updateProduct(
        { productId: product._id, updatedProduct: data },
        {
          onSuccess: () => {
            setListOfImages([]);
            reset();
            navigate("/admin/products/all", { replace: true });
          },
        },
      );
    } else
      createProduct(data, {
        onSuccess: () => {
          setListOfImages([]);
          reset();
          navigate("/admin/products/all", { replace: true });
        },
      });
  };

  return (
    <section>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-between items-start lg:items-center gap-4 bg-gray-50 pb-3 pt-4 sticky top-15 z-10">
          <div>
            <div className="mb-3">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="text-[#3f6b4c] hover:underline inline-flex items-center gap-1 group font-medium"
              >
                <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
                <span>Volver a Productos</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold">
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h1>
            <div className="text-gray-600 text-sm">
              {product
                ? "Edita la información del producto seleccionado."
                : "Crea un nuevo producto para la tienda."}
            </div>
          </div>
          <div className="hidden md:flex flex-col sm:flex-row gap-2 md:w-auto">
            <button
              type="button"
              disabled={isSaving || isPendingProduct}
              onClick={() => navigate("/admin/products")}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-[#3f6b4c]/20 rounded bg-white hover:bg-[#f5f0e6]/30 transition group hover:shadow-md hover:-translate-y-0.5"
            >
              Cancelar
            </button>
            <button
              disabled={isSaving || isPendingProduct || !isValid}
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3f6b4c] text-white rounded hover:bg-[#2e4d36] focus:outline-none focus:ring-2 focus:ring-[#3f6b4c] transition font-semibold"
            >
              {isSaving ? (
                <>
                  <LoaderCircleIcon className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5 md:hidden lg:inline-block" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GeneralInfoSection
            register={register}
            errors={errors}
            isSaving={isSaving}
            isPendingProduct={isPendingProduct}
          />

          <div className="bg-white rounded-lg p-6 shadow-md shadow-[#4b2e2e]/5 border border-[#3f6b4c]/10">
            <ImageUploaderSection
              listOfImages={listOfImages}
              setListOfImages={setListOfImages}
              register={register}
              errors={errors}
              isSaving={isSaving}
              isPendingProduct={isPendingProduct}
            />

            <div className="mt-7 md:hidden gap-3 flex justify-end">
              <button
                disabled={isSaving || isPendingProduct || !isValid}
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3f6b4c] text-white rounded hover:bg-[#2e4d36] focus:outline-none focus:ring-2 focus:ring-[#3f6b4c] transition font-semibold"
              >
                {isSaving ? (
                  <>
                    <LoaderCircleIcon className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-5 h-5 md:hidden lg:inline-block" />
                    Guardar
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={isSaving || isPendingProduct}
                onClick={() => navigate("/admin/products")}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#3f6b4c]/20 rounded bg-white hover:bg-[#f5f0e6]/30 transition group hover:shadow-md hover:-translate-y-0.5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
