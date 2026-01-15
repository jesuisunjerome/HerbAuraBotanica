import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import NoData from "../components/NoData";
import SEORender from "../layouts/SEORender";
import { productos, sortByOptions } from "../lib/data";
import { formatCurrency } from "../lib/helper";
import { useCartStore } from "../store/useCartStore";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");

  const filteredProducts = productos
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price?.toString().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOption === "price-low-high") {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortOption === "price-high-low") {
        return parseFloat(b.price) - parseFloat(a.price);
      } else if (sortOption === "newest") {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return 0;
    });

  const { addToCart } = useCartStore();
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const updateSearchParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    updateSearchParams("search", e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    updateSearchParams("sort", e.target.value);
  };

  return (
    <>
      <SEORender
        title="Catálogo de Productos :: HerbAura Botanica"
        description="Explora shampoos, aceites y tónicos HerbAura Botanica. Productos herbales premium para un cabello sano y radiante."
      />
      <header className="px-3 lg:px-20 md:px-5">
        <div
          className="flex items-center min-h-95 py-5 px-10 rounded-3xl mb-10 relative overflow-hidden"
          style={{
            background: "url('/images/6.png') no-repeat center center",
            backgroundSize: "cover",
          }}
        >
          <div className="max-w-2xl text-white z-10">
            <h1
              className="text-4xl lg:text-5xl mb-5"
              style={{
                lineHeight: 1,
              }}
            >
              Descubre el poder de lo natural
            </h1>
            <p className="text-lg lg:text-xl">
              Explora nuestro catálogo de tratamientos botánicos diseñados para
              nutrir, fortalecer y realzar la esencia única de tu cabello.
            </p>
          </div>
          <div className="absolute inset-0 bg-linear-to-t  from-black/70 to-black/5"></div>
        </div>
      </header>

      <section className="py-20 lg:px-20 px-3 md:px-5 bg-white relative">
        <div className="flex flex-wrap justify-between gap-8 mb-15">
          <h1 className="text-3xl lg:text-5xl">
            🍃Catálogo de{" "}
            <span
              className="text-amber-600 relative"
              style={{
                fontFamily: "Playfair Display, serif",
              }}
            >
              Productos{" "}
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
            </span>
          </h1>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
            <p className="hidden lg:flex items-center gap-2">
              Filtros: <SlidersHorizontalIcon />{" "}
            </p>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    updateSearchParams("search", "");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <XIcon />
                </button>
              )}
            </div>
            <select
              className="border border-gray-300 rounded-md p-2 h-11 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={sortOption}
              onChange={handleSortChange}
            >
              {sortByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
          {filteredProducts.length === 0 && (
            <NoData message="No se encontraron productos." />
          )}
          {filteredProducts.map((item) => (
            <div
              key={item.productId}
              className="rounded-2xl overflow-hidden group relative bg-gray-200 p-3 hover:scale-105 transition-transform duration-400"
            >
              <img
                loading="lazy"
                src={item.img}
                className="w-full h-80 bg-gray-200 object-contain group-hover:scale-90 transition-transform delay-100 duration-1000"
                alt={item.name}
              />
              <button
                title="Agregar al carrito"
                onClick={() => handleAddToCart(item)}
                className="absolute top-2 right-2 p-2 size-10 flex items-center justify-center rounded-xl bg-white/60 hover:shadow-lg backdrop-blur-sm"
              >
                <ShoppingCartIcon className="w-5 h-5" />
              </button>
              <Link
                title="Ver detalles"
                to={`/products/${item.productId}`}
                className="flex items-center group -translate-y-0.5 transition-all absolute left-1/2 transform -translate-x-1/2 w-[95%] rounded-xl overflow-hidden bottom-1 p-3 bg-white/60 backdrop-blur-sm"
              >
                <span className="flex gap-1 flex-1 flex-col">
                  <span className="block text-xl font-bold">
                    {formatCurrency(item.price)}
                  </span>
                  <small className="block">
                    {searchTerm ? (
                      <>
                        {item.name
                          .split(new RegExp(`(${searchTerm})`, "gi"))
                          .map((part, index) =>
                            part.toLowerCase() === searchTerm.toLowerCase() ? (
                              <span key={index} className="bg-amber-300">
                                {part}
                              </span>
                            ) : (
                              <span key={index}>{part}</span>
                            ),
                          )}
                      </>
                    ) : (
                      <>{item.name}</>
                    )}
                  </small>
                </span>
                <span className="block text-end p-2 h-10 w-10 rounded-full transition-all group-hover:translate-x-2">
                  <ChevronRightIcon className="w-6 h-6 group-hover:animate-bounce ml-auto" />
                </span>
              </Link>
            </div>
          ))}
        </div>

        {filteredProducts.length > 0 && <Pagination />}
      </section>

      <section className="px-3 py-20 lg:px-20 md:px-5 relative">
        <div
          className="rounded-xl flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden"
          style={{
            background: "url(/images/6.png) no-repeat center center",
            backgroundSize: "cover",
          }}
        >
          <div className="w-full md:w-[60%] px-10 py-20 bg-black ms-auto text-white">
            <div className="max-w-xl">
              <div className="mb-4">
                <h2 className="text-2xl lg:text-3xl mb-3">
                  ¿Listo para transformar tu cabello?
                </h2>
                <p className="text-lg">
                  Descubre la magia de los ingredientes botánicos con HerbAura
                  Botanica. ¡Tu cabello merece lo mejor de la naturaleza!
                </p>
              </div>
              <Link
                to="/contacto"
                className="py-3 px-6 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-lg pt-30 pb-20 mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-1">
            ¡Suscríbete a nuestro boletín para las últimas actualizaciones y
            ofertas!
          </h3>
          <p className="text-gray-500">
            Únete a nuestra comunidad y sé el primero en conocer nuevos
            productos y ofertas exclusivas.
          </p>

          <form className="mt-4 mb-2 flex gap-2">
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
              Suscribirse
            </button>
          </form>

          <small>
            Respetamos tu privacidad. Desuscríbete en cualquier momento. Lee
            nuestra{" "}
            <Link className="text-amber-600" to="/privacy-policy">
              Política de Privacidad
            </Link>
            .
          </small>
        </div>

        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -bottom-4 left-0 h-8 w-full z-10 pointer-events-none"
          alt=""
        />
        <div className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-10 blur-3xl bg-amber-100 rounded-lg animate-pulse" />
      </section>
    </>
  );
}

function Pagination() {
  return (
    <div className="flex justify-center items-center gap-3 mt-20">
      <button className="py-3 px-5 rounded-lg bg-gray-200 hover:bg-gray-300">
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <button className="py-3 px-5 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
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
