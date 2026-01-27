import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditIcon,
  HeartIcon,
  InfoIcon,
  LoaderCircleIcon,
  PlusCircleIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../../../hooks/products/mutations";
import { useFetchProductById } from "../../../hooks/products/queries";
import { productSchema } from "../../../lib/schemas";
import RHFCheckbox from "../../common/form/RHFCheckbox";
import RHFInput from "../../common/form/RHFInput";
import RHFTextarea from "../../common/form/RHFTextarea";

export default function ProductForm() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const navigate = useNavigate();

  const { isPending, product } = useFetchProductById(productId);
  const { isCreating, createProduct } = useCreateProduct();
  const { isUpdating, updateProduct } = useUpdateProduct();

  // If editing an existing product, verify its state, load its data then populate the form
  const isPendingProduct = isPending && !!productId;

  const imagesRef = useRef(null);
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
    // defaultValues: product ?? newProduct,
    values: product,
    resolver: zodResolver(productSchema),
    mode: "all",
  });

  const handleSaveAsMainImage = (index) => {
    setListOfImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      })),
    );
  };

  const handleChangeImages = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readers = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
      });
    });
    Promise.all(readers).then((images) => {
      setListOfImages((prev) => {
        const hasMainImage = prev.some((img) => img.isMain);
        const newImages = images.map((url, index) => ({
          url,
          isMain: !hasMainImage && index === 0,
        }));
        return [...prev, ...newImages];
      });
    });
  };

  const handleDeleteImg = (index) => {
    setListOfImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      const wasMain = prev[index].isMain;

      if (wasMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }

      return newImages;
    });
  };

  const handleReplaceImg = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Image = reader.result;
        setListOfImages((prev) => {
          const newImages = [...prev];
          newImages[index] = {
            ...newImages[index],
            url: base64Image,
          };
          return newImages;
        });
      };
    };

    input.click();
  };

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
          <h1 className="text-2xl font-semibold">Nuevo Producto</h1>
          <div className="hidden md:flex flex-col sm:flex-row gap-2 md:w-auto">
            <button
              type="button"
              disabled={isSaving || isPendingProduct}
              onClick={() => navigate("/admin/products")}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded bg-white transition group hover:shadow-lg hover:-translate-y-0.5"
            >
              Cancelar
            </button>
            <button
              disabled={isSaving || isPendingProduct || !isValid}
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
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
          <div className="bg-white rounded-lg p-6">
            <p className="text-xl mb-6">General Information</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <RHFCheckbox
                  id="isActive"
                  defaultChecked={true}
                  register={register}
                  disabled={isSaving || isPendingProduct}
                >
                  Mostrar producto
                </RHFCheckbox>
              </div>
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <RHFInput
                  label="Nombre del Producto"
                  id="name"
                  required={true}
                  register={register}
                  error={errors.name}
                  disabled={isSaving || isPendingProduct}
                />
              </div>
              <div>
                <RHFInput
                  label="Categoría"
                  id="category"
                  required={true}
                  register={register}
                  error={errors.category}
                  disabled={isSaving || isPendingProduct}
                />
              </div>
              <div>
                <RHFInput
                  label="Precio"
                  id="price"
                  type="number"
                  step="0.01"
                  required={true}
                  register={register}
                  error={errors.price}
                  min={0}
                  disabled={isSaving || isPendingProduct}
                />
              </div>
              <div>
                <RHFInput
                  label="Cantidad"
                  id="stockQuantity"
                  type="number"
                  required={true}
                  register={register}
                  error={errors.stockQuantity}
                  min={0}
                  disabled={isSaving || isPendingProduct}
                />
              </div>
              <div>
                <RHFInput
                  label="Descuento (%)"
                  id="discountPercentage"
                  type="number"
                  step="0.01"
                  register={register}
                  error={errors.discountPercentage}
                  min={0}
                  max={100}
                  disabled={isSaving || isPendingProduct}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <RHFTextarea
                  label="Descripción"
                  id="description"
                  required={true}
                  register={register}
                  error={errors.description}
                  disabled={isSaving || isPendingProduct}
                  rows={5}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
              <div>
                <RHFInput
                  label="Etiquetas (separadas por comas)"
                  id="tags"
                  required={true}
                  register={register}
                  error={errors.tags}
                  placeholder="Etiqueta 1, Etiqueta 2"
                  disabled={isSaving || isPendingProduct}
                />
              </div>
              <div className="2xl:col-span-2">
                <label className="block mb-2 text-gray-700">
                  Imagen del producto <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-5">
                  {listOfImages.find((img) => img.isMain) && (
                    <div className="col-span-3 xl:col-span-4">
                      <div className="flex items-center justify-center h-70 w-full bg-gray-50 rounded-md overflow-hidden">
                        <img
                          src={listOfImages.find((img) => img.isMain).url}
                          className="size-full object-contain"
                          alt=""
                        />
                      </div>
                    </div>
                  )}

                  {listOfImages.map((image, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 h-35 overflow-hidden rounded-lg flex items-center justify-center relative group transition-transform duration-400"
                    >
                      <img
                        src={image.url}
                        className="w-full h-full object-contain"
                        alt=""
                      />

                      <div className="absolute top-2 left-2">
                        <button
                          type="button"
                          title="Marcar como imagen principal"
                          onClick={() => handleSaveAsMainImage(index)}
                          className={`rounded-full p-2 shadow-lg disabled:cursor-not-allowed ${image.isMain ? "text-pink-600 bg-pink-100" : "text-gray-600 bg-gray-50"}`}
                        >
                          <HeartIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 right-2 md:-bottom-10 md:group-hover:bottom-2 transition-all flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleReplaceImg(index)}
                          title="Cambiar imagen"
                          className="text-white bg-black/80 rounded-full p-2 shadow-md disabled:cursor-not-allowed"
                          disabled={isSaving || isPendingProduct}
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImg(index)}
                          title="Eliminar"
                          className=" text-red-600 bg-white rounded-full p-2 shadow-md disabled:cursor-not-allowed"
                          disabled={isSaving || isPendingProduct}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      title="Agregar imágenes"
                      type="button"
                      onClick={() => imagesRef.current.click()}
                      className="w-full bg-indigo-50/70 h-35 overflow-hidden rounded-lg flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                      disabled={isSaving || isPendingProduct}
                    >
                      <input
                        ref={imagesRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleChangeImages}
                      />
                      <PlusCircleIcon className="w-6 h-6 text-indigo-600" />
                    </button>
                  </div>
                </div>
                <p className="flex gap-2 text-sm text-gray-500 mt-2 items-center leading-tight">
                  <InfoIcon className="w-6 h-6" />{" "}
                  <span>
                    Necesitas al menos 2 imágenes. Presta atención a la calidad
                    de las imágenes para una mejor presentación del producto.
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-7 md:hidden gap-3 flex justify-end">
              <button
                disabled={isSaving || isPendingProduct || !isValid}
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
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
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded bg-white transition group hover:shadow-lg hover:-translate-y-0.5"
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
