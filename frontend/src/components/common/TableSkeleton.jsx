export default function TableSkeleton({ className, arrLength = 10 }) {
  return (
    <div className={`w-full space-y-6 animate-pulse min-h-150 ${className}`}>
      <div className="grid grid-cols-8 gap-4 mb-6">
        <div className="col-span-2 h-7 bg-gray-50 rounded w-full" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-7 bg-gray-50 rounded w-full"></div>
        ))}
      </div>
      <div className="space-y-6">
        {Array.from({ length: arrLength }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-5 bg-gray-50 rounded w-full"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
