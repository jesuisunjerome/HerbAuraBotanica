import {
  DotIcon,
  HandshakeIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TruckElectricIcon,
} from "lucide-react";
import { useParams } from "react-router";
import SEORender from "../layouts/SEORender";
import { productos } from "../lib/data";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { name, description, img, price } =
    productos.find((p) => p.productoId === parseInt(productId)) || {};

  return (
    <>
      <SEORender
        title={`${name} :: HerbAura Botanica`}
        description={description}
      />
      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="w-full sm:w-9/12 md:w-8/12 mx-auto lg:w-5/12">
            <div className="sticky top-20">
              <div className="p-3 rounded-2xl overflow-hidden bg-gray-100">
                <img
                  loading="lazy"
                  src={img}
                  className="w-full object-contain h-100 bg-gray-100 rounded-2xl"
                  alt={name}
                />
              </div>
              <div className="mt-5 flex justify-center gap-3">
                <div className="bg-gray-100 overflow-hidden rounded-2xl p-2">
                  <img
                    loading="lazy"
                    src={img}
                    className="w-24 h-24 object-contain bg-gray-100 rounded-2xl"
                    alt={name}
                  />
                </div>
                <div className="bg-gray-100 overflow-hidden rounded-2xl p-2">
                  <img
                    loading="lazy"
                    src="/images/img-3.jpeg"
                    className="w-24 h-24 object-contain bg-gray-100 rounded-2xl"
                    alt={name}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto sm:w-9/12 md:w-8/12 lg:w-7/12">
            <div className="mx-auto lg:mx-0 lg:max-w-lg">
              <div className="pb-5 mb-5 border-b border-gray-300/50">
                <h1 className="text-3xl font-semibold">{name}</h1>
                <p>⭐ 4.9 (120 reseñas)</p>
                <h3 className="text-3xl mb-5">${price}</h3>
                <div className="flex flex-wrap gap-0.5 text-sm font-semibold">
                  <span>Cuidado Natural</span>
                  <DotIcon />
                  <span>Vegano</span>
                  <DotIcon />
                  <span>Libre de Sulfatos</span>
                </div>
                <p className="text-gray-700 leading-7">{description}</p>
              </div>

              <div className="flex flex-wrap items-end gap-5 pb-5 mb-5 border-b border-gray-300/50">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block mb-2 font-semibold"
                  >
                    Cantidad:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-max p-1 gap-3">
                    <button className="bg-gray-200 rounded-md p-1 h-10 w-10 flex items-center justify-center">
                      <MinusIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <span className="text-2xl px-3">1</span>
                    <button className="bg-gray-200 rounded-md p-1 h-10 w-10 flex items-center justify-center">
                      <PlusIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex justify-center items-center gap-2">
                    <ShoppingCartIcon /> <span>Agregar al carrito</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                  <span>
                    <TruckElectricIcon className="h-7 w-7 text-amber-500" />
                  </span>
                  <span className="text-gray-600 text-sm">
                    <strong>Envío gratuito</strong> en pedidos superiores a $50
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                  <span>
                    <HandshakeIcon className="h-7 w-7 text-blue-500" />
                  </span>
                  <span className="text-gray-600 text-sm">
                    <strong>Garantía de satisfacción</strong> o te devolvemos tu
                    dinero
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-300/50">
                <h4 className="text-lg">Ingredientes Clave y Sus Beneficios</h4>
                <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                  <li>
                    <p className="font-semibold">🍃 Aceite de Argán Orgánico</p>
                    <p>
                      Hidrata profundamente y repara el cabello dañado,
                      devolviendo brillo y suavidad naturales.
                    </p>
                  </li>
                  <li>
                    <p className="font-semibold">🌱 Extracto de Aloe Vera</p>
                    <p>
                      Calma el cuero cabelludo irritado y fortalece las raíces,
                      promoviendo un crecimiento saludable.
                    </p>
                  </li>
                  <li>
                    <p className="font-semibold">
                      🌿 Proteína de Queratina Natural
                    </p>
                    <p>
                      Restaura la estructura capilar dañada, eliminando el frizz
                      y proporcionando protección térmica.
                    </p>
                  </li>
                  <li>
                    <p className="font-semibold">✨ Vitamina E Antioxidante</p>
                    <p>
                      Protege contra los radicales libres y el daño ambiental,
                      dejando el cabello resistente y radiante.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-10 blur-3xl bg-amber-100 rounded-lg animate-pulse" />
      </section>
    </>
  );
}
