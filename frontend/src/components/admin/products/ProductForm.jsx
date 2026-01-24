import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditIcon,
  ImageIcon,
  InfoIcon,
  LoaderCircleIcon,
  PlusCircleIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useCreateProduct } from "../../../hooks/products/mutations";
import { newProduct } from "../../../lib/data";
import { productSchema } from "../../../lib/schemas";
import RHFCheckbox from "../../common/form/RHFCheckbox";
import RHFInput from "../../common/form/RHFInput";
import RHFTextarea from "../../common/form/RHFTextarea";

export default function ProductForm() {
  const mainRef = useRef(null);
  const secondaryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSecondaryImages, setSelectedSecondaryImages] = useState([]);

  const {
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm({
    defaultValues: newProduct,
    resolver: zodResolver(productSchema),
    mode: "all",
  });

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
    };
  };

  const handleSecondaryImageChange = (e) => {
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
      setSelectedSecondaryImages((prev) => [...prev, ...images]);
      setValue("images", [...selectedSecondaryImages, ...images]);
    });
  };

  const handleDeleteImg = (index) => {
    setSelectedSecondaryImages((prev) => prev.filter((_, i) => i !== index));
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
        setSelectedSecondaryImages((prev) => {
          const newImages = [...prev];
          newImages[index] = base64Image;
          return newImages;
        });
      };
    };

    input.click();
  };

  useEffect(() => {
    setValue("images", [...selectedSecondaryImages, selectedImage]);
  }, [selectedSecondaryImages, selectedImage, setValue]);

  const { isCreating, createProduct } = useCreateProduct();
  const isSaving = isSubmitting || isCreating;
  const onSubmit = (data) => {
    createProduct(data);
    setSelectedImage(null);
    setSelectedSecondaryImages([]);
    reset();
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-semibold">Nuevo Producto</h1>
          <div className="hidden md:flex flex-col sm:flex-row gap-2 md:w-auto">
            <Link
              disabled={isSaving}
              to="/admin/products/all"
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded bg-white transition group hover:shadow-lg hover:-translate-y-0.5"
            >
              Cancelar
            </Link>
            <button
              disabled={isSaving || !isValid}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
              <div>
                <RHFInput
                  label="Categoría"
                  id="category"
                  required={true}
                  register={register}
                  error={errors.category}
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <RHFTextarea
                  label="Descripción"
                  id="description"
                  required={true}
                  register={register}
                  error={errors.description}
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
              <div className="2xl:col-span-2">
                <label className="block mb-2 text-gray-700">
                  Imagen del producto <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-5">
                  <div className="col-span-3 xl:col-span-4">
                    <button
                      type="button"
                      onClick={() => mainRef.current.click()}
                      className="flex items-center justify-center h-70 w-full bg-gray-50 border border-dashed border-gray-300 rounded-md overflow-hidden relative group"
                      disabled={isSaving}
                    >
                      {selectedImage ? (
                        <>
                          <img
                            src={selectedImage}
                            className="size-full object-contain"
                            alt=""
                          />
                          {!isSaving && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                              <span className="text-white text-xs">
                                Cambiar imagen principal
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center max-w-sm">
                          <ImageIcon
                            strokeWidth={1}
                            className="w-15 h-15 text-gray-400"
                          />
                          <p className="mt-2">
                            Haz clic para subir la imagen principal
                          </p>
                          <p className="text-gray-600 text-sm leading-tight">
                            Los formatos aceptados son JPG, PNG y GIF. Tamaño
                            máximo de 5MB.
                          </p>
                        </div>
                      )}
                    </button>
                    <input
                      ref={mainRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainImageChange}
                    />
                  </div>
                  {selectedSecondaryImages.map((image, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 h-35 overflow-hidden rounded-lg flex items-center justify-center relative"
                    >
                      <img
                        src={image}
                        className="w-full h-full object-contain"
                        alt=""
                      />

                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={() => handleReplaceImg(index)}
                          title="Cambiar imagen"
                          className="me-2 text-white bg-black/80 rounded-full p-2 shadow-md"
                          disabled={isSaving}
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImg(index)}
                          title="Eliminar"
                          className=" text-red-600 bg-white rounded-full p-2 shadow-md"
                          disabled={isSaving}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      title="Agregar imagen secundaria"
                      type="button"
                      onClick={() => secondaryRef.current.click()}
                      className="w-full bg-indigo-50 h-35 overflow-hidden rounded-lg flex items-center justify-center cursor-pointer"
                      disabled={isSaving}
                    >
                      <input
                        ref={secondaryRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleSecondaryImageChange}
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
                disabled={isSaving || !isValid}
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
              <Link
                disabled={isSaving}
                to="/admin/products/all"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded bg-white transition group hover:shadow-lg hover:-translate-y-0.5"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
