import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SEORender from "../../components/common/SEORender";
import LoadingSkeletonProduct from "../../components/public/catalog/LoadingSkeletonProduct";
import Banner from "../../components/public/home/Banner";
import BestSeller from "../../components/public/home/BestSeller";
import FeaturedProduct from "../../components/public/home/FeaturedProduct";
import Gallery from "../../components/public/home/Gallery";
import NewProductCard from "../../components/public/home/NewProductCard";
import {
  useFetchBestSellers,
  useFetchNewArrivals,
} from "../../hooks/products/queries";
import { useCartStore } from "../../store/useCartStore";

export default function HomePage() {
  const { addToCart } = useCartStore();
  const { isPending, newProducts } = useFetchNewArrivals();
  const { isPending: isPendingBestSellers, bestSellers } =
    useFetchBestSellers();

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
          alt="Decorative vector graphic"
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
          <>
            {newProducts.length > 0 && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-10">
                {newProducts.map((item) => (
                  <NewProductCard
                    key={item._id}
                    item={item}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </>
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

      <BestSeller isPending={isPendingBestSellers} bestSellers={bestSellers} />

      <FeaturedProduct
        isPending={isPendingBestSellers}
        bestSellers={bestSellers}
      />

      <Gallery />
    </>
  );
}
