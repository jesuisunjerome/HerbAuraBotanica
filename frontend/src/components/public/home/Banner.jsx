import { ChevronLeftIcon } from "lucide-react";
import { Link } from "react-router";
import GradientBg from "../../common/GradientBg";

export default function Banner() {
  return (
    <header className="grid lg:grid-cols-2 min-h-[80vh] pt-5 gap-10 px-3 lg:px-20 md:px-5 relative">
      <div className="flex flex-col items-center lg:items-start justify-center py-10 lg:py-0">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-5xl mb-6">
            🍃 Cuidado natural del cabello con{" "}
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
            className="absolute bottom-0 left-0 h-8 w-full pointer-events-none"
            alt=""
          />
        </div>
      </div>
      <GradientBg />
    </header>
  );
}
