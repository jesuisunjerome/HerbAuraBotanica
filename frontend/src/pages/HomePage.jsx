import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import GradientBg from "../components/GradientBg";
import SEORender from "../layouts/SEORender";
import { featuredProducts, galleryImages, productos } from "../lib/data";
import { useCartStore } from "../store/useCartStore";

export default function HomePage() {
  const { addToCart } = useCartStore();

  const sliderRef = useRef(null);
  const [emblaRef] = useEmblaCarousel(
    { loop: true, autoplay: true, align: "start" },
    [Autoplay({ stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const settings = {
    infinite: true,
    speed: 500,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <>
      <SEORender
        title="HerbAura Botanica"
        description="Descubre HerbAura Botanica: productos naturales para el cuidado del cabello. Shampoos, aceites y tónicos herbales para un cabello sano y radiante. Cuidado capilar natural con aloe, romero y jengibre. Nutre tu cabello con hierbas orgánicas."
      />
      <header className="grid lg:grid-cols-2 min-h-[80vh] pt-5 gap-10 px-3 lg:px-20 md:px-5 relative">
        <div className="flex flex-col items-center lg:items-start justify-center py-10 lg:py-0">
          <div className="max-w-xl">
            <h1 className="text-4xl lg:text-5xl mb-6">
              🍃 Cuidado Natural del Cabello con{" "}
              <span className="text-amber-600 relative">
                HerbAura
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              <span className="text-amber-600 relative">
                Botanica
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>
            </h1>
            <p className="text-lg mb-6">
              Descubre el poder de la naturaleza para el cuidado de tu cabello.
              Nuestros productos están formulados con ingredientes naturales y
              hierbas orgánicas para nutrir y revitalizar tu melena.
            </p>
            <div className="flex items-center flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-amber-600 text-white px-6 py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
              >
                Explorar Productos{" "}
                <ChevronLeftIcon className="inline w-5 h-5 ml-2 rotate-180 group-hover:translate-x-2 transition-all" />
              </Link>
              <div className="flex items-center gap-1">
                <div className="flex -space-x-3.5">
                  <img
                    loading="lazy"
                    src="https://i.pravatar.cc/100?img=16"
                    alt=""
                    className="size-9 object-cover rounded-full border-2 border-white bg-gray-200"
                  />
                  <img
                    loading="lazy"
                    src="https://i.pravatar.cc/100?img=28"
                    alt=""
                    className="size-9 object-cover rounded-full border-2 border-white bg-gray-200"
                  />
                  <img
                    loading="lazy"
                    src="https://i.pravatar.cc/100?img=27"
                    alt=""
                    className="size-9 object-cover rounded-full border-2 border-white bg-gray-200"
                  />
                </div>
                <span className="text-sm text-gray-600 self-center">
                  <strong>+1,200</strong> compras
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <div className="sm:w-[70%] md:w-[60%] lg:w-[75%] xl:w-[65%] h-150 lg:h-[90vh] mx-auto rounded-t-full overflow-hidden mt-10 lg:mt-0 relative">
            <img
              loading="lazy"
              src="/images/8.png"
              alt="HerbAura Botanica - Cuidado Natural del Cabello"
              className="w-full h-full object-cover bg-gray-200"
            />
            <img
              loading="lazy"
              src="/images/vector-1.png"
              className="absolute bottom-0 left-0 h-8 w-full"
              alt=""
            />
          </div>
        </div>
        <GradientBg />
      </header>

      <section className="py-25 bg-white px-3 lg:px-20 md:px-5 relative">
        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -top-4 left-0 h-8 w-full rotate-180"
          alt=""
        />
        <div
          className="absolute -top-8 left-0 z-10 w-full h-8"
          style={{
            background: "url(/images/vector.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
          }}
        />
        <div className="flex gap-3 mb-15">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-5xl">
              Nature's touch for{" "}
              <span
                className="text-amber-600 relative"
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Healthy
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              <span
                className="text-amber-600 relative "
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Beautiful
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              Hair 🌙
            </h1>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-10">
          {productos.slice(0, 5).map((item) => (
            <div className="rounded-2xl group overflow-hidden relative bg-gray-200 p-3  hover:scale-105 transition-transform duration-400">
              <img
                loading="lazy"
                src={item.img}
                className="w-full h-80 bg-gray-200 object-contain group-hover:scale-90 transition-transform delay-100 duration-1000"
                alt={item.name}
              />
              <button
                title="Agregar al carrito"
                onClick={() => handleAddToCart(item)}
                className="absolute group-hover:top-2 -top-100 right-2 p-2 size-10 flex items-center justify-center rounded-xl bg-white/60 hover:shadow-lg backdrop-blur-sm"
              >
                <ShoppingCartIcon className="w-5 h-5" />
              </button>
              <Link
                title="Ver detalles"
                to={`/products/${item.productoId}`}
                className="flex items-center group hover:-translate-y-0.5 transition-all absolute left-1/2 transform -translate-x-1/2 w-[95%] rounded-xl overflow-hidden bottom-1 p-3 bg-white/60 backdrop-blur-sm"
              >
                <span className="flex gap-1 flex-1 flex-col">
                  <span className="block group-hover:hidden transition-all">
                    {item.name}
                  </span>
                  <span className="hidden group-hover:block text-xl font-bold">
                    ${item.price}
                  </span>
                  <small className="hidden group-hover:block">
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

      <section className="py-20 px-3 lg:px-20 md:px-5 relative overflow-hidden">
        <Slider ref={sliderRef} {...settings}>
          {featuredProducts.map((product) => (
            <div>
              <div
                key={product.productoId}
                className="grid lg:grid-cols-3 gap-10"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-lg text-amber-600 font-medium">
                    ✨ {product.name}
                  </p>
                  <h2 className="text-4xl">{product.description}</h2>
                  <div className="mt-auto">
                    <Link
                      to={`/products/${product.productoId}`}
                      className="px-5 text-sm py-3 inline-flex items-center justify-between gap-3 rounded group bg-amber-600 text-white hover:bg-amber-700 transition"
                    >
                      Comprar Ahora
                      <ChevronRightIcon className="inline w-4 h-4 group-hover:translate-x-2 transition-all" />
                    </Link>
                  </div>
                </div>
                <div className="col-span-2 xl:col-span-1 lg:col-start-2">
                  <img
                    loading="lazy"
                    src={product.img}
                    className="h-140 object-cover w-full lg:w-[90%] rounded-2xl bg-gray-200"
                    alt={product.name}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <div className="flex gap-2 absolute bottom-15 right-5 xl:left-3/4 xl:transform xl:-translate-x-3/4">
          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="w-14 h-14 rounded-full bg-white text-amber-600 hover:text-white px-4 py-2 group hover:bg-amber-700 transition hover:shadow-lg shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
          >
            <ChevronLeftIcon className="w-10 h-10" />
          </button>
          <button
            onClick={() => sliderRef.current.slickNext()}
            className="w-14 h-14 rounded-full bg-white text-amber-600 hover:text-white px-4 py-2 group hover:bg-amber-700 transition hover:shadow-lg shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
          >
            <ChevronRightIcon className="w-10 h-10" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-10 blur-3xl bg-amber-100 rounded-lg animate-pulse" />
      </section>

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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
                    <ShoppingCartIcon className="w-5 h-5" />
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
          className="absolute -top-4 left-0 h-8 w-full rotate-180"
          alt=""
        />
      </section>

      <section className="py-30 px-3 lg:px-20 md:px-5  relative">
        <GradientBg />
        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -top-4 left-0 h-8 w-full rotate-180"
          alt=""
        />

        <div className="max-w-3xl mb-10">
          <h2 className="text-4xl lg:text-4xl mb-6">
            🌿 Galería de{" "}
            <span className="text-amber-600 relative">
              HerbAura
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
            </span>{" "}
            <span className="text-amber-600 relative">
              Botanica
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
            </span>
          </h2>

          <p>
            Explora nuestra galería visual que captura la esencia de HerbAura
            Botanica. Desde ingredientes naturales hasta resultados
            transformadores, cada imagen refleja nuestro compromiso con el
            cuidado capilar natural y efectivo.
          </p>
        </div>

        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {galleryImages.map((src, index) => (
                <div key={index} className="embla__slide px-4">
                  <img
                    loading="lazy"
                    src={src}
                    className="h-60 md:h-70 lg:90 w-full object-cover rounded-xl bg-gray-200"
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -bottom-4 left-0 h-8 w-full rotate-180"
          alt=""
        />
      </section>
    </>
  );
}
