import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { bestSellerProducts } from "../../../lib/data";

export default function BestSeller() {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 500,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <section className="py-20 px-3 lg:px-20 md:px-5 relative overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {bestSellerProducts.map((product) => (
          <div>
            <div key={product.productId} className="grid lg:grid-cols-3 gap-10">
              <div className="flex flex-col gap-2">
                <p className="text-lg text-amber-600 font-medium">
                  ✨ {product.name}
                </p>
                <h2 className="text-2xl md:text-4xl">{product.description}</h2>
                <div className="mt-auto mb-2 pb-2">
                  <Link
                    to={`/products/${product.productId}`}
                    className="inline-block bg-amber-600 text-white px-5 text-sm py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Comprar Ahora
                    <ChevronRightIcon className="inline w-4 h-4 ml-2 group-hover:translate-x-2 transition-all" />
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
  );
}
