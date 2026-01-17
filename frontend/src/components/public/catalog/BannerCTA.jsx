import { Link } from "react-router";

export default function BannerCTA() {
  return (
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
  );
}
