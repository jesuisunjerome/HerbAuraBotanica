import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import NoData from "../../common/NoData";
import ProductCard from "./ProductCard";

export default function ProductList({
  filteredProducts,
  handleAddToCart,
  searchTerm,
}) {
  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {filteredProducts.length === 0 && (
          <NoData message="No se encontraron productos." />
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

      {filteredProducts.length > 10 && <Pagination />}
    </>
  );
}

function Pagination() {
  return (
    <div className="flex justify-center items-center gap-3 mt-20">
      <button className="py-3 px-5 rounded-lg bg-gray-200 hover:bg-gray-300">
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <button className="py-3 px-5 rounded-lg bg-[#3f6b4c] text-white hover:bg-[#2e4d36]">
        1
      </button>
      <button className="py-3 px-5 rounded-lg bg-gray-200 hover:bg-gray-300">
        2
      </button>
      <button className="py-3 px-5 rounded-lg bg-gray-200 hover:bg-gray-300">
        3
      </button>
      <button className="py-3 px-5 rounded-lg bg-gray-200 hover:bg-gray-300">
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
