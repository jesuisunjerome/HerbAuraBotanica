import { ChevronLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import ImagesDetails from "../../components/public/product-details/ImagesDetails";
import ProductDetails from "../../components/public/product-details/ProductDetails";
import { useFetchProductById } from "../../hooks/products/queries";
import SEORender from "../../layouts/SEORender";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { isPending, product = {} } = useFetchProductById(productId);
  const { name, description } = product;

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
            className="text-amber-600 hover:underline flex items-center gap-1 group"
          >
            <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
            <span>Volver a Productos</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          <ImagesDetails product={product} isPending={isPending} />
          <ProductDetails product={product} isPending={isPending} />
        </div>

        <div className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-10 blur-3xl bg-amber-100 rounded-lg animate-pulse" />
      </section>
    </>
  );
}
