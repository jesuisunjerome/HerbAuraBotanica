import Banner from "../../components/public/catalog/Banner";
import BannerCTA from "../../components/public/catalog/BannerCTA";
import FilterProducts from "../../components/public/catalog/FilterProducts";
import LoadingSkeletonProduct from "../../components/public/catalog/LoadingSkeletonProduct";
import NewsLetter from "../../components/public/catalog/NewsLetter";
import ProductList from "../../components/public/catalog/ProductList";
import { useRenderCatalog } from "../../hooks/products/queries";
import SEORender from "../../layouts/SEORender";

export default function CatalogPage() {
  const {
    filteredProducts,
    isPending,
    searchTerm,
    sortOption,
    handleSearchChange,
    handleSortChange,
    handleAddToCart,
  } = useRenderCatalog();

  return (
    <>
      <SEORender
        title="Catálogo de Productos :: HerbAura Botanica"
        description="Explora shampoos, aceites y tónicos HerbAura Botanica. Productos herbales premium para un cabello sano y radiante."
      />
      <Banner />

      <section className="pb-20 lg:px-20 px-3 md:px-5 bg-white relative">
        <FilterProducts
          searchTerm={searchTerm}
          sortOption={sortOption}
          handleSearchChange={handleSearchChange}
          handleSortChange={handleSortChange}
        />
        {isPending ? (
          <LoadingSkeletonProduct />
        ) : (
          <ProductList
            filteredProducts={filteredProducts}
            handleAddToCart={handleAddToCart}
            searchTerm={searchTerm}
          />
        )}
      </section>

      <section className="px-3 py-20 lg:px-20 md:px-5 relative">
        <BannerCTA />
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
