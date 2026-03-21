import { ChevronLeftIcon } from "lucide-react";
import { Link } from "react-router";
import GradientBg from "../../common/GradientBg";

export default function Banner() {
  return (
    <header className="grid lg:grid-cols-2 min-h-[80vh] pt-5 gap-10 px-3 lg:px-20 md:px-5 relative">
      <div className="flex flex-col items-center lg:items-start justify-center py-10 lg:py-0">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-5xl mb-6">
            🌱 Donde las hierbas{" "}
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
            alt="HerbAura Botanica - Cuidado Natural del Cabello"
          />
          <img
            loading="lazy"
            src="/images/vector-1.png"
            className="absolute -bottom-4 left-0 h-8 w-[90%] pointer-events-none"
            alt="Decorative vector graphic"
          />
        </div>
      </div>
      <GradientBg />
    </header>
  );
}
