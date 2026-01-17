import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import RHFCheckbox from "../../components/common/form/RHFCheckbox";
import RHFInput from "../../components/common/form/RHFInput";
import RHFTextarea from "../../components/common/form/RHFTextarea";
import { useCreateProduct } from "../../hooks/products/mutations";
import { productSchema } from "../../lib/productSchema";

export default function ProductPage() {
  const mainRef = useRef(null);
  const secondaryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSecondaryImages, setSelectedSecondaryImages] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // defaultValues: newProduct,
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

  const { createProduct } = useCreateProduct();
  const onSubmit = (data) => {
    createProduct(data);
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="w-full md:w-6/12">
            <h1 className="text-xl mb-4">Agregar nuevo producto</h1>
          </div>
          <div className="w-full md:w-6/12">
            <button type="submit">Guardar</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 h-max">
            <h2 className="text-lg mb-4">Detalles del Producto</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="lg:col-span-2">
                <RHFCheckbox
                  id="isActive"
                  defaultChecked={true}
                  register={register}
                >
                  Mostrar producto
                </RHFCheckbox>
              </div>
              <div className="lg:col-span-1">
                <RHFInput
                  label="Nombre del Producto"
                  id="name"
                  required={true}
                  register={register}
                  error={errors.name}
                />
              </div>
              <div className="lg:col-span-1">
                <RHFInput
                  label="Categoría"
                  id="category"
                  required={true}
                  register={register}
                  error={errors.category}
                />
              </div>
              <div className="lg:col-span-1">
                <RHFInput
                  label="Precio"
                  id="price"
                  type="number"
                  step="0.01"
                  required={true}
                  register={register}
                  error={errors.price}
                  min={0}
                />
              </div>
              <div className="lg:col-span-1">
                <RHFInput
                  label="Cantidad"
                  id="stockQuantity"
                  type="number"
                  required={true}
                  register={register}
                  error={errors.stockQuantity}
                  min={0}
                />
              </div>
              <div className="lg:col-span-2">
                <RHFTextarea
                  label="Descripción"
                  id="description"
                  required={true}
                  register={register}
                  error={errors.description}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg mb-4">Imágenes del Producto</h2>

            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-3">
                <button
                  type="button"
                  onClick={() => mainRef.current.click()}
                  className="block h-70 w-full bg-gray-100 border border-dashed border-gray-300 rounded-md cursor-pointer overflow-hidden relative group"
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      className="size-full object-contain"
                      alt=""
                    />
                  ) : (
                    <></>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                    <span className="text-white text-xs">
                      Cambiar imagen principal
                    </span>
                  </div>
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
                      className="me-2 text-white bg-black rounded-full p-2 shadow-md"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImg(index)}
                      title="Eliminar"
                      className=" text-red-600 bg-white rounded-full p-2 shadow-md"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  onClick={() => secondaryRef.current.click()}
                  className="w-full bg-indigo-50 h-35 overflow-hidden rounded-lg flex items-center justify-center cursor-pointer"
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
          </div>
        </div>
      </form>
    </section>
  );
}
