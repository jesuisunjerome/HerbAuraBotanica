import {
  EditIcon,
  HeartIcon,
  InfoIcon,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { useRef } from "react";
import RHFInput from "../../common/form/RHFInput";
import { compressImageToBase64, getOptimizedCloudinaryUrl } from "../../../lib/helper";

export default function ImageUploaderSection({
  listOfImages,
  setListOfImages,
  register,
  errors,
  isSaving,
  isPendingProduct,
}) {
  const imagesRef = useRef(null);

  const handleSaveAsMainImage = (index) => {
    setListOfImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
  };

  const handleChangeImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const compressedImages = await Promise.all(
      Array.from(files).map((file) => compressImageToBase64(file))
    );

    setListOfImages((prev) => {
      const hasMainImage = prev.some((img) => img.isMain);
      const newImages = compressedImages.map((url, index) => ({
        url,
        isMain: !hasMainImage && index === 0,
      }));
      return [...prev, ...newImages];
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

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const base64Image = await compressImageToBase64(file);

      setListOfImages((prev) => {
        const newImages = [...prev];
        newImages[index] = {
          ...newImages[index],
          url: base64Image,
        };
        return newImages;
      });
    };

    input.click();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md shadow-[#4b2e2e]/5 border border-[#3f6b4c]/10">
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        <div>
          <RHFInput
            label="Etiquetas (separadas por comas)"
            id="tags"
            required={true}
            register={register}
            error={errors?.tags}
            placeholder="Etiqueta 1, Etiqueta 2"
            disabled={isSaving || isPendingProduct}
          />
        </div>
        <div className="2xl:col-span-2">
          <label htmlFor="images" className="block mb-2 text-gray-700">
            Imagen del producto <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-5">
            {listOfImages.find((img) => img.isMain) && (
              <div className="col-span-3 xl:col-span-4">
                <div className="flex items-center justify-center h-70 w-full bg-gray-50 rounded-md overflow-hidden">
                  <img
                    src={getOptimizedCloudinaryUrl(
                      listOfImages.find((img) => img.isMain).url,
                      500
                    )}
                    className="size-full object-contain"
                    alt="Imagen principal del producto"
                  />
                </div>
              </div>
            )}

            {listOfImages.map((image, index) => (
              <div
                key={index}
                className="bg-gray-50 h-35 overflow-hidden rounded-lg flex items-center justify-center relative group border border-[#3f6b4c]/10 transition-transform duration-400"
              >
                <img
                  src={getOptimizedCloudinaryUrl(image.url, 200)}
                  className="w-full h-full object-contain"
                  alt={`Imagen del producto ${index + 1}`}
                />

                <div className="absolute top-2 left-2">
                  <button
                    type="button"
                    title="Marcar como imagen principal"
                    onClick={() => handleSaveAsMainImage(index)}
                    className={`rounded-full p-2 shadow-lg disabled:cursor-not-allowed ${
                      image.isMain
                        ? "text-pink-600 bg-pink-100"
                        : "text-gray-600 bg-gray-50"
                    }`}
                  >
                    <HeartIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 md:-bottom-10 md:group-hover:bottom-2 transition-all flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleReplaceImg(index)}
                    title="Cambiar imagen"
                    className="text-[#4b2e2e] bg-[#f5f0e6] hover:bg-[#ebdcb9] rounded-full p-2 shadow-md disabled:cursor-not-allowed transition"
                    disabled={isSaving || isPendingProduct}
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteImg(index)}
                    title="Eliminar"
                    className="text-red-600 bg-white hover:bg-red-50 rounded-full p-2 shadow-md disabled:cursor-not-allowed transition"
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
                className="w-full bg-[#f5f0e6]/50 hover:bg-[#f5f0e6]/80 border-2 border-dashed border-[#3f6b4c]/30 h-35 overflow-hidden rounded-lg flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition"
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
                <PlusCircleIcon className="w-6 h-6 text-[#3f6b4c]" />
              </button>
            </div>
          </div>
          <p className="flex gap-2 text-sm text-gray-500 mt-2 items-center leading-tight">
            <InfoIcon className="w-6 h-6 text-[#3f6b4c]" />{" "}
            <span>
              Necesitas al menos 2 imágenes. Presta atención a la calidad de las
              imágenes para una mejor presentación del producto.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
