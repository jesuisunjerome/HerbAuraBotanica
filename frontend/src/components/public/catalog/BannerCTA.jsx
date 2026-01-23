import { Link } from "react-router";

export default function BannerCTA() {
  return (
    <div
      className="rounded-lg flex flex-col lg:flex-row overflow-hidden"
      // style={{
      //   background: "url(/images/6.png) no-repeat center center",
      //   backgroundSize: "cover",
      // }}
    >
      <div className="lg:w-1/2 lg:max-h-150">
        <img
          loading="lazy"
          src="/images/6.png"
          alt="Banner CTA HerbAura Botanica"
          className="w-full h-80 lg:h-full object-cover"
        />
      </div>
      <div className="lg:w-1/2 px-10 py-20 bg-[#dbf3e1] flex items-center text-black">
        <div className="lg:max-w-xl">
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
            className="py-3 px-6 bg-[#3f6b4c] text-white rounded-lg hover:bg-[#2e4d36] transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
