export default function LoadingSkeletonProduct() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl overflow-hidden group relative bg-gray-50 p-3 animate-pulse"
        >
          <div className="w-full h-80 bg-gray-100 mb-4"></div>
          <div className="h-6 bg-gray-100 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-100 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
