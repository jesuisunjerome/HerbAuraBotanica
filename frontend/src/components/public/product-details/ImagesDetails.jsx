import { useEffect, useState } from "react";

export default function ImagesDetails({ product, isPending }) {
  const { images, name } = product;
  const [selectedImage, setSelectedImage] = useState(images?.[0] || null);

  const handleToggleImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (isPending) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full sm:w-9/12 md:w-8/12 mx-auto lg:w-5/12">
      <div className="sticky top-20">
        <div className="p-3 rounded-2xl overflow-hidden bg-gray-100">
          <img
            loading="lazy"
            src={selectedImage || images?.[0]}
            className="w-full object-contain h-100 bg-gray-100 rounded-2xl"
            alt={name}
          />
        </div>
        <div className="mt-5 flex gap-3 overflow-x-scroll p-1 pb-2 scrollbar-hide">
          {images?.map((image) => (
            <button
              key={image}
              onClick={() => handleToggleImage(image)}
              className={`bg-gray-100 overflow-hidden rounded-2xl p-2  shrink-0 ${selectedImage === image ? "ring-2 ring-offset-2 ring-gray-200" : ""}`}
            >
              <img
                loading="lazy"
                src={image}
                className="w-24 h-24 object-contain bg-gray-100 rounded-2xl"
                alt={name}
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full sm:w-9/12 md:w-8/12 mx-auto lg:w-5/12 animate-pulse">
      <div className="sticky top-20">
        <div className="p-3 rounded-2xl overflow-hidden bg-gray-200 h-96" />
        <div className="mt-5 flex justify-center gap-3">
          <div className="bg-gray-200 overflow-hidden rounded-2xl p-2 w-24 h-24" />
          <div className="bg-gray-200 overflow-hidden rounded-2xl p-2 w-24 h-24" />
        </div>
      </div>
    </div>
  );
}
