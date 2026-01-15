export default function NoData({ message, img }) {
  return (
    <div className="col-span-full text-center py-20 min-h-80 flex flex-col justify-center items-center gap-4 bg-gray-100 rounded-2xl">
      <img src={img || "/images/no-data.png"} className="h-50" alt={message} />
      <p className="text-xl text-gray-500">
        {message || "Intenta con otros términos o elimina los filtros."}
      </p>
    </div>
  );
}
