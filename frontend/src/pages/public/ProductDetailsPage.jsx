import { ChevronLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import SEORender from "../../components/common/SEORender";
import LoadingSkeletonProduct from "../../components/public/catalog/LoadingSkeletonProduct";
import ProductCard from "../../components/public/catalog/ProductCard";
import NewProductCard from "../../components/public/home/NewProductCard";
import ImagesDetails from "../../components/public/product-details/ImagesDetails";
import ProductDetails from "../../components/public/product-details/ProductDetails";
import {
  useFetchActiveProducts,
  useFetchProductById,
  useFetchSimilarProducts,
} from "../../hooks/products/queries";
import { useCartStore } from "../../store/useCartStore";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useCartStore();

  const { isPending, product = {} } = useFetchProductById(productId);
  const { name, description } = product;

  const { isPending: isActiveProductsPending, products: activeProducts = [] } =
    useFetchActiveProducts(!isPending && !product?._id);
  const { isPending: isSimilarProductsPending, similarProducts = [] } =
    useFetchSimilarProducts(product._id);

  return (
    <>
      <SEORender
        title={`${name || "Hair Care"} :: HerbAura Botanica`}
        description={description || "Detalle del producto en HerbAura Botanica"}
      />
      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative">
        <div className="mb-5">
          <Link
            to="/products"
            className="text-amber-600 hover:underline inline-flex items-center gap-1 group"
          >
            <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
            <span>Volver a Productos</span>
          </Link>
        </div>

        {!isPending && !product?._id ? (
          <>
            <div className="rounded bg-red-100 text-red-600 p-5 mb-10">
              <span className="">
                El producto que buscas no existe o ha sido eliminado.
              </span>
            </div>
            {isActiveProductsPending ? (
              <LoadingSkeletonProduct />
            ) : (
              <>
                <div className="max-w-2xl mb-10">
                  <h2 className="text-2xl lg:text-3xl">
                    ✨ Productos{" "}
                    <span
                      className="text-amber-600 relative"
                      style={{
                        fontFamily: "Playfair Display, serif",
                      }}
                    >
                      que podrían interesarte
                    </span>
                  </h2>
                  <p>
                    Explora nuestra selección de productos destacados y
                    encuentra alternativas que se adapten a tus necesidades.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                  {activeProducts.slice(0, 5).map((item) => (
                    <ProductCard
                      key={item._id}
                      item={item}
                      handleAddToCart={addToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-20">
            <ImagesDetails product={product} isPending={isPending} />
            <ProductDetails product={product} isPending={isPending} />
          </div>
        )}

        <div className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-10 blur-3xl bg-amber-100 rounded-lg animate-pulse" />
      </section>

      {!isSimilarProductsPending && similarProducts.length > 0 && (
        <section className="px-3 lg:px-20 md:px-5 py-10 bg-white">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl lg:text-3xl">
              ✨ Productos{" "}
              <span
                className="text-amber-600 relative"
                style={{
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Similares
              </span>
            </h2>
            <p>
              Explora más opciones dentro de la misma categoría y encuentra
              productos que complementan tu elección.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {similarProducts.map((item) => (
              <NewProductCard
                key={item._id}
                item={item}
                addToCart={addToCart}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
