import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { galleryImages } from "../../../lib/data";
import GradientBg from "../../common/GradientBg";

export default function Gallery() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, autoplay: true, align: "start" },
    [Autoplay({ stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  return (
    <section className="py-30 px-3 lg:px-20 md:px-5  relative">
      <GradientBg />
      <img
        loading="lazy"
        src="/images/vector.png"
        className="absolute -top-4 left-0 h-8 w-full rotate-180 pointer-events-none"
        alt=""
      />

      <div className="max-w-3xl mb-10">
        <h2 className="text-3xl lg:text-4xl">
          📸 Galería de{" "}
          <span className="text-amber-600 relative">
            HerbAura
            <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
          </span>{" "}
          <span className="text-amber-600 relative">
            Botanica
            <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
          </span>
        </h2>

        <p className="mt-5">
          Explora nuestra galería visual que captura la esencia de HerbAura
          Botanica. Desde ingredientes naturales hasta resultados
          transformadores, cada imagen refleja nuestro compromiso con el cuidado
          capilar natural y efectivo.
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
        className="absolute -bottom-4 left-0 h-8 w-full rotate-180 z-10 pointer-events-none"
        alt=""
      />
    </section>
  );
}
