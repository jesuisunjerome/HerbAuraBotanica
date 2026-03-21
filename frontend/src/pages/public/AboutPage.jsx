import { ChevronLeftIcon } from "lucide-react";
import { Link } from "react-router";
import GradientBg from "../../components/common/GradientBg";
import SEORender from "../../components/common/SEORender";
import NewsLetter from "../../components/public/catalog/NewsLetter";

export default function AboutPage() {
  return (
    <>
      <SEORender
        title="Nosotros :: HerbAura Botanica"
        description="HerbAura Botanica: belleza consciente y natural. Inspirados en hierbas y rituales botánicos para tu bienestar."
      />

      <header className="grid lg:grid-cols-2 min-h-[80vh] pt-5 gap-10 px-3 lg:px-20 md:px-5 relative">
        <div className="flex flex-col items-center lg:items-start justify-center py-10 lg:py-0">
          <div className="max-w-xl">
            <h1 className="text-4xl lg:text-5xl mb-6">
              Donde las hierbas{" "}
              <span className="text-amber-600 relative">
                nutren
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              <span className="text-amber-600 relative">
                el aura
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              de tu cabello
            </h1>
            <p className="text-lg mb-6">
              En HerbAura Botanica creemos en el poder transformador de la
              naturaleza. Nuestros productos combinan ingredientes botánicos
              cuidadosamente seleccionados con rituales ancestrales de belleza,
              para nutrir tu cabello desde la raíz y revelar su brillo natural.
              Descubre la conexión entre bienestar y belleza consciente.
            </p>
            <div className="flex items-center flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-amber-600 text-white px-6 py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
              >
                Contáctanos{" "}
                <ChevronLeftIcon className="inline w-5 h-5 ml-2 rotate-180 group-hover:translate-x-2 transition-all" />
              </Link>
              <button className="px-6 py-3 rounded group border border-gray-200 text-gray-600 hover:bg-gray-100 transition">
                Nuestra Historia
              </button>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <div className="sm:w-[70%] md:w-[60%] lg:w-[75%] xl:w-[65%] h-150 lg:h-[70vh] mx-auto mt-10 overflow-hiddens lg:mt-0 sticky top-20">
            <img
              loading="lazy"
              src="/images/7.png"
              alt="HerbAura Botanica - Cuidado Natural del Cabello"
              className="w-full h-full object-cover bg-gray-200 rounded-2xl"
            />
            <img
              loading="lazy"
              src="/images/2.png"
              className="absolute bottom-0 left-6 h-60 object-cover w-[60%] pointer-events-none rounded-t-2xl ring-4 ring-white ring-offset-1"
              alt=""
            />
            <img
              loading="lazy"
              src="/images/vector-1.png"
              className="absolute -bottom-4 left-0 h-8 w-[90%] pointer-events-none"
              alt=""
            />
          </div>
        </div>
        <GradientBg />
      </header>

      <section className="py-30 px-3 lg:px-20 md:px-5 relative">
        <div className="flex gap-3 mb-10 md:mb-20">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl">
              ¿Por qué elegir{" "}
              <span
                className="text-amber-600 relative"
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                HerbAura
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>{" "}
              <span
                className="text-amber-600 relative"
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Botanica
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
              </span>
              ?
            </h1>
            <p className="text-2xl lg:text-3xl mt-2">
              Belleza consciente inspirada en la sabiduría botánica
            </p>
            <p className="mt-6">
              Cada producto que creamos es una fusión entre la tradición herbal
              y la ciencia moderna. Trabajamos con ingredientes orgánicos de
              origen sostenible, libres de químicos agresivos, para ofrecerte
              una experiencia de cuidado capilar que respeta tu cabello y el
              planeta.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mb-10 md:mb-20">
          <div className="md:w-3/4 grid sm:grid-cols-2 gap-10 md:ml-auto">
            <div>
              <div className="md:max-w-sm">
                <p className="text-xl font-semibold">✨ Misión</p>
                <p className="text-gray-600">
                  Transformar el cuidado capilar a través de productos botánicos
                  de alta calidad, promoviendo la belleza natural y el bienestar
                  integral. Creemos que cada persona merece sentirse radiante,
                  sin comprometer su salud ni el medio ambiente.
                </p>
              </div>
            </div>
            <div>
              <div className="md:max-w-sm">
                <p className="text-xl font-semibold">✨ Visión</p>
                <p className="text-gray-600">
                  Ser la marca líder en cuidado capilar botánico, inspirando una
                  comunidad global que valore la autenticidad, la sostenibilidad
                  y el poder transformador de las hierbas. Queremos que cada
                  persona descubra su aura única a través de nuestra filosofía
                  natural.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-120">
          <img
            loading="lazy"
            src="/images/9.png"
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      <section className="py-25 bg-white px-3 lg:px-20 md:px-5 relative">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 bg-gray-50 px-7 py-10 rounded-2xl relative">
            <div className="max-w-lg mb-5">
              <h1 className="text-3xl mb-3">
                ✨ Ingredientes Puros y Naturales
              </h1>
              <p>
                Cada fórmula está enriquecida con extractos botánicos
                cuidadosamente seleccionados: romero, aloe vera, lavanda, menta
                y aceites esenciales que nutren, fortalecen y revitalizan tu
                cabello de manera natural.
              </p>
            </div>
            <div className="grid grid-cols-2 items-center gap-5 relative">
              <div>
                <img
                  loading="lazy"
                  src="/images/3.png"
                  alt=""
                  className="w-full h-50 object-cover rounded-lg"
                />
              </div>
              <div>
                <img
                  loading="lazy"
                  src="/images/3.png"
                  alt=""
                  className="w-full h-50 object-cover rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <img
                  loading="lazy"
                  src="/images/3.png"
                  alt=""
                  className="w-full h-60 object-cover rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-gray-50 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[20%] bg-linear-to-t from-white to-transparent" />
          </div>
          <div className="w-full md:w-1/2 space-y-5 sticky top-20 self-start">
            <div className="bg-amber-50 px-7 py-10 rounded-2xl">
              <div className="flex -space-x-4 mb-10">
                <img
                  loading="lazy"
                  src="https://i.pravatar.cc/100?img=16"
                  alt=""
                  className="size-15 object-cover rounded-full border-2 border-white bg-gray-200"
                />
                <img
                  loading="lazy"
                  src="https://i.pravatar.cc/100?img=28"
                  alt=""
                  className="size-15 object-cover rounded-full border-2 border-white bg-gray-200"
                />
                <img
                  loading="lazy"
                  src="https://i.pravatar.cc/100?img=29"
                  alt=""
                  className="size-15 object-cover rounded-full border-2 border-white bg-gray-200"
                />
                <img
                  loading="lazy"
                  src="https://i.pravatar.cc/100?img=27"
                  alt=""
                  className="size-15 object-cover rounded-full border-2 border-white bg-gray-200"
                />
                <div className="size-15 object-cover rounded-full border-2 border-white bg-amber-600 flex items-center justify-center text-white text-2xl font-semibold">
                  +
                </div>
              </div>
              <p className="text-amber-600 self-center text-xl flex items-center gap-2">
                <span className="text-5xl font-semibold">+1,200</span> compras
              </p>
            </div>
            <div className="bg-[#dbf3e1] px-7 py-10 rounded-2xl space-y-4">
              <p>
                Nuestro compromiso va más allá de la belleza. Utilizamos envases
                eco-friendly, apoyamos a productores locales y donamos un
                porcentaje de nuestras ganancias a proyectos de reforestación.
                Porque cuidar de ti también es cuidar del planeta. Únete a
                nuestra comunidad de personas conscientes que eligen productos
                con propósito y corazón verde.
              </p>
              <Link
                to="/products"
                className="py-3 px-6 bg-[#3f6b4c] text-white rounded-lg hover:bg-[#2e4d36] transition-colors"
              >
                Conoce Nuestros Productos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 py-20 lg:px-20 md:px-5 relative">
        <NewsLetter />
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
