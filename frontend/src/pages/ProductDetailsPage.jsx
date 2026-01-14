import SEORender from "../layouts/SEORender";

export default function ProductDetailsPage() {
  const productName = "Producto"; // Cambia esto según el producto actual
  const productDescription = "Descripción del producto"; // Cambia esto según el producto actual

  return (
    <>
      <SEORender
        title={`${productName} :: HerbAura Botanica`}
        description={productDescription}
      />
      <div>
        <h1>Product Page</h1>
      </div>
    </>
  );
}
