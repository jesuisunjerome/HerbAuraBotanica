import NoData from "../../common/NoData";
import ProductCard from "./ProductCard";

export default function ProductList({
  filteredProducts,
  handleAddToCart,
  searchTerm,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) {
  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {filteredProducts.length === 0 && (
          <NoData
            img="/images/no-products.webp"
            message="No se encontraron productos."
          />
        )}

        {filteredProducts.map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            handleAddToCart={handleAddToCart}
            searchTerm={searchTerm}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-20">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="py-3 px-8 rounded-full border-2 border-[#3f6b4c] bg-white text-[#3f6b4c] font-semibold hover:bg-[#3f6b4c] hover:text-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#3f6b4c] focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? "Cargando..." : "Cargar más productos"}
          </button>
        </div>
      )}
    </>
  );
}

