import { ChevronRightIcon, HandbagIcon } from "lucide-react";
import { Link } from "react-router";
import { formatCurrency, getDiscountedPrice } from "../../../lib/helper";

export default function NewProductCard({ item, addToCart }) {
  const { hasDiscount, price, discountedPrice } = getDiscountedPrice(
    item.price,
    item.discountPercentage,
  );

  return (
    <div className="rounded-2xl group overflow-hidden relative bg-gray-200 p-3  hover:scale-105 transition-transform duration-400">
      <img
        loading="lazy"
        src={item.images.find((img) => img.isMain)?.url}
        className="w-full h-80 bg-gray-200 object-contain group-hover:scale-90 transition-transform delay-100 duration-1000"
        alt={item.name}
      />
      <button
        title="Agregar al carrito"
        onClick={() => addToCart(item)}
        className="absolute group-hover:top-2 top-2 lg:-top-100 right-2 p-2 size-10 flex items-center justify-center rounded-xl bg-white/60 hover:shadow-lg backdrop-blur-sm"
      >
        <HandbagIcon className="w-5 h-5" />
      </button>
      <Link
        title="Ver detalles"
        to={`/products/${item._id}`}
        className="flex items-center group hover:-translate-y-0.5 transition-all absolute left-1/2 transform -translate-x-1/2 w-[95%] rounded-xl overflow-hidden bottom-1 p-3 bg-white/60 backdrop-blur-sm"
      >
        <span className="flex gap-1 flex-1 flex-col">
          <span className="hidden lg:block group-hover:hidden transition-all">
            {item.name}
          </span>
          <div>
            <span className="inline-block lg:hidden group-hover:inline-block text-xl font-bold">
              {formatCurrency(discountedPrice)}
            </span>
            {Boolean(hasDiscount) && (
              <span className="line-through inline-block lg:hidden group-hover:inline-block ml-2 text-gray-500">
                {formatCurrency(price)}
              </span>
            )}
          </div>
          <small className="block lg:hidden group-hover:block">
            {item.name}
          </small>
        </span>
        <span className="block text-end p-2 h-10 w-10 rounded-full transition-all group-hover:translate-x-2">
          <ChevronRightIcon className="w-6 h-6 group-hover:animate-bounce ml-auto" />
        </span>
      </Link>
    </div>
  );
}
