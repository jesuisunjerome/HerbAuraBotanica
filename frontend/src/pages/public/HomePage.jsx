import { ChevronRightIcon, HandbagIcon } from "lucide-react";
import { Link } from "react-router";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SEORender from "../../components/common/SEORender";
import LoadingSkeletonProduct from "../../components/public/catalog/LoadingSkeletonProduct";
import Banner from "../../components/public/home/Banner";
import BestSeller from "../../components/public/home/BestSeller";
import Gallery from "../../components/public/home/Gallery";
import { useFetchActiveProducts } from "../../hooks/products/queries";
import { formatCurrency } from "../../lib/helper";
import { useCartStore } from "../../store/useCartStore";

export default function HomePage() {
  const { addToCart } = useCartStore();
  const { isPending, products } = useFetchActiveProducts();

  return (
    <>
      <SEORender
        title="HerbAura Botanica"
        description="Descubre HerbAura Botanica: productos naturales para el cuidado del cabello. Shampoos, aceites y tónicos herbales para un cabello sano y radiante. Cuidado capilar natural con aloe, romero y jengibre. Nutre tu cabello con hierbas orgánicas."
      />

      <Banner />

      <section className="py-25 bg-white px-3 lg:px-20 md:px-5 relative">
        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -top-4 left-0 h-8 w-full rotate-180 pointer-events-none"
          alt=""
        />
        <div
          className="absolute -top-8 left-0 z-10 w-full h-8 pointer-events-none"
          style={{
            background: "url(/images/vector.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
          }}
        />
        <div className="flex gap-3 mb-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl">
              El toque de la{" "}
              <span
                className="text-amber-600 relative"
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                naturaleza
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              para{" "}
              <span
                className="text-amber-600 relative"
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                cabello
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              <span
                className="text-amber-600 relative "
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                saludable
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              y{" "}
              <span
                className="text-amber-600 relative "
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                hermoso
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              🌙
            </h1>
            <p className="mt-5">
              Explora nuestra selección cuidada de productos naturales para el
              cuidado del cabello, elaborados con ingredientes herbales para
              nutrir y revitalizar tu melena. Abraza la belleza de la naturaleza
              con HerbAura Botanica.
            </p>
          </div>
        </div>

        {isPending ? (
          <LoadingSkeletonProduct />
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-10">
            {products.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="rounded-2xl group overflow-hidden relative bg-gray-200 p-3  hover:scale-105 transition-transform duration-400"
              >
                <img
                  loading="lazy"
                  src={item.images[0]}
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
                    <span className="block lg:hidden group-hover:block text-xl font-bold">
                      {formatCurrency(item.price)}
                    </span>
                    <small className="block lg:hidden group-hover:block">
                      {item.name}
                    </small>
                  </span>
                  <span className="block text-end p-2 h-10 w-10 rounded-full transition-all group-hover:translate-x-2">
                    <ChevronRightIcon className="w-6 h-6 group-hover:animate-bounce ml-auto" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/products"
            className="mt-10 inline-block bg-amber-600 text-white px-5 text-sm py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
          >
            Ver Todos los Productos{" "}
            <ChevronRightIcon className="inline w-4 h-4 ml-2 group-hover:translate-x-2 transition-all" />
          </Link>
        </div>
      </section>

      <BestSeller />

      <section
        className="px-3 lg:px-20 md:px-5 relative py-10"
        style={{
          background: "url(/images/modelo-2.jpeg) center center no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="flex min-h-170 items-end justify-between rounded-2xl p-10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-10 flex-1">
            <div className="max-w-2xl grid sm:grid-cols-3 gap-5">
              <div
                className="col-span-1 sm:col-span-2 lg:col-span-1
               rounded-2xl group overflow-hidden relative bg-gray-200 h-100 sm:h-60"
              >
                <img
                  loading="lazy"
                  src="/images/1.png"
                  alt="Producto Natural para el Cuidado del Cabello"
                  className="w-full h-full bg-gray-200 object-cover"
                />
              </div>
              <div className="sm:col-span-3 lg:col-span-2 text-white">
                <h2 className="text-2xl md:text-4xl mb-4">
                  Shampoo Natural de Aloe Vera y Jengibre
                </h2>
                <p className="text-lg mb-6">
                  Nuestro shampoo está formulado con aloe vera y jengibre para
                  limpiar suavemente tu cabello mientras lo nutre profundamente.
                  Ideal para todo tipo de cabello, deja tu melena suave,
                  brillante y saludable.
                </p>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-4xl font-bold">$12.99</span>
                  <button
                    title="Agregar al carrito"
                    onClick={() =>
                      addToCart({
                        productId: 1,
                        name: "Shampoo Natural de Aloe Vera y Jengibre",
                        price: 12.99,
                      })
                    }
                    className="w-14 h-14 rounded-full bg-white/30 text-white backdrop-blur-sm hover:text-white px-4 py-2 group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <HandbagIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
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
          alt=""
        />
      </section>

      <Gallery />
    </>
  );
}
