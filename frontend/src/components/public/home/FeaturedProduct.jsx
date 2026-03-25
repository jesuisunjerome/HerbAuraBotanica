import { ChevronRightIcon, HandbagIcon } from "lucide-react";
import { Link } from "react-router";
import { useCartStore } from "../../../store/useCartStore";

export default function FeaturedProduct({ isPending, bestSellers }) {
  const { addToCart } = useCartStore();

  return (
    <section
      className="px-3 lg:px-20 md:px-5 relative py-10"
      style={{
        background:
          "url(/images/modelos/modelo-2.jpeg) center center no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex min-h-170 items-end justify-between rounded-2xl p-10 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-10 flex-1">
          {isPending ? (
            <LoadingSkeleton />
          ) : (
            <div className="max-w-2xl grid sm:grid-cols-3 gap-5">
              <div
                className="col-span-1 sm:col-span-2 lg:col-span-1
               rounded-2xl group overflow-hidden relative bg-gray-200 h-100 sm:h-60"
              >
                <img
                  loading="lazy"
                  src={bestSellers[0].product.images[0].url}
                  alt={bestSellers[0].product.name}
                  className="w-full h-full bg-gray-200 object-cover"
                />
              </div>
              <div className="sm:col-span-3 lg:col-span-2 text-white">
                <h2 className="text-2xl md:text-4xl mb-4">
                  {bestSellers[0].product.name}
                </h2>
                <p
                  className="text-lg mb-6"
                  title={bestSellers[0].product.description}
                >
                  {bestSellers[0].product.description.length > 250
                    ? `${bestSellers[0].product.description.substring(0, 250)}...`
                    : bestSellers[0].product.description}
                </p>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-4xl font-bold">
                    ${bestSellers[0].product.price}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      title="Agregar al carrito"
                      onClick={() => addToCart(bestSellers[0].product)}
                      className="w-14 h-14 rounded-full bg-white/30 text-white backdrop-blur-sm hover:text-white px-4 py-2 group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
                    >
                      <HandbagIcon className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/products/${bestSellers[0].product._id}`}
                      className="inline-block bg-white/30 text-white backdrop-blur-sm px-5 text-sm py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Ver Detalles{" "}
                      <ChevronRightIcon className="inline w-4 h-4 ml-2 group-hover:translate-x-2 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="md:max-w-md md:ms-auto opacity-70 text-white border-white/30 border-2 rounded-2xl p-6 bg-white/10 backdrop-blur-sm md:border-0 md:bg-transparent">
            <p>
              Descubre el poder de la naturaleza para tu cabello explorando
              nuestra gama de productos naturales y transforma tu rutina de
              cuidado capilar hoy mismo.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-block bg-white/30 backdrop-blur-sm text-white px-5 text-sm py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
            >
              Explorar Productos{" "}
              <ChevronRightIcon className="inline w-4 h-4 ml-2 group-hover:translate-x-2 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      <img
        loading="lazy"
        src="/images/vector.png"
        className="absolute -top-4 left-0 h-8 w-full rotate-180 pointer-events-none"
        alt="Decorative vector graphic"
      />
    </section>
  );
}

const LoadingSkeleton = () => (
  <div className="w-full max-w-2xl grid sm:grid-cols-3 gap-5 animate-pulse">
    <div
      className="col-span-1 sm:col-span-2 lg:col-span-1
               rounded-2xl group overflow-hidden relative h-100 sm:h-60"
    >
      <div className="w-full h-full bg-gray-100/30 object-cover" />
    </div>
    <div className="sm:col-span-3 lg:col-span-2 text-white">
      <div className="bg-gray-100/30 h-6 w-full rounded mb-4" />
      <div className="space-y-2 mb-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-100/30 h-4 w-full rounded" />
        ))}
      </div>
      <div className="flex items-center justify-between gap-5">
        <span className="bg-gray-100/30 h-8 w-20 rounded"></span>
        <div className="w-14 h-14 rounded-full bg-white/30" />
      </div>
    </div>
  </div>
);
