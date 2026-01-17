export default function ImagesDetails({ product, isPending }) {
  const { images, name } = product;

  if (isPending) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full sm:w-9/12 md:w-8/12 mx-auto lg:w-5/12">
      <div className="sticky top-20">
        <div className="p-3 rounded-2xl overflow-hidden bg-gray-100">
          <img
            loading="lazy"
            src={images?.[0]}
            className="w-full object-contain h-100 bg-gray-100 rounded-2xl"
            alt={name}
          />
        </div>
        <div className="mt-5 flex justify-center gap-3">
          <div className="bg-gray-100 overflow-hidden rounded-2xl p-2">
            <img
              loading="lazy"
              src={images?.[0]}
              className="w-24 h-24 object-contain bg-gray-100 rounded-2xl"
              alt={name}
            />
          </div>
          <div className="bg-gray-100 overflow-hidden rounded-2xl p-2">
            <img
              loading="lazy"
              src={images?.[1]}
              className="w-24 h-24 object-contain bg-gray-100 rounded-2xl"
              alt={name}
            />
          </div>
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
