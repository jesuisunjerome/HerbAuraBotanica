import { useParams } from "react-router";
import ProductForm from "../../components/admin/products/ProductForm";
import ProductList from "../../components/admin/products/ProductList";

export default function ProductPage() {
  const { tab } = useParams();

  if (tab === "new") return <ProductForm />;
  return <ProductList />;
}
