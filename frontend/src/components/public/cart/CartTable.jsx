import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { formatCurrency } from "../../../lib/helper";
import { useCartStore } from "../../../store/useCartStore";

export default function CartTable({ item }) {
  const { addToCart, decreaseQuantity, removeFromCart } = useCartStore();

  return (
    <div className="py-4 border-t border-gray-100 grid grid-cols-3 lg:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
      <div className="col-span-3 lg:col-auto flex items-center gap-6">
        <div className="bg-gray-100 overflow-hidden rounded-xl p-2">
          <img
            loading="lazy"
            src={item.images[0]}
            className="w-20 h-20 object-contain bg-gray-100 rounded-xl"
            alt={item.name}
          />
        </div>
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-amber-600">{formatCurrency(item.price)}</p>
          <p
            className="text-xs max-w-xs line-clamp-2 text-gray-600 leading-5"
            title={item.description}
          >
            {item.description}
          </p>
        </div>
      </div>
      <div className="col-span-2 lg:col-auto">
        <div className="flex items-center border border-gray-300 rounded-lg w-max p-0.5 gap-3">
          <button
            onClick={() => decreaseQuantity(item._id)}
            className="bg-gray-200 rounded-md p-1 h-7 w-7 flex items-center justify-center"
          >
            <MinusIcon className="h-4 w-4 text-gray-600" />
          </button>
          <span className="text-lg px-3">{item.quantity}</span>
          <button
            onClick={() => addToCart(item)}
            className="bg-gray-200 rounded-md p-1 h-7 w-7 flex items-center justify-center"
          >
            <PlusIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div>
        <button
          onClick={() => removeFromCart(item._id)}
          className="bg-red-100 hover:bg-red-200 text-red-800 rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
