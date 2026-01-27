import {
  CreditCardIcon,
  DotIcon,
  HandbagIcon,
  HandshakeIcon,
  TruckElectricIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCartStore } from "../../../store/useCartStore";

export default function ProductDetails({ product, isPending }) {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const { name, price, description, tags } = product;

  if (isPending) return <LoadingSkeleton />;

  return (
    <div className="w-full mx-auto sm:w-9/12 md:w-8/12 lg:w-7/12">
      <div className="mx-auto lg:mx-0 lg:max-w-lg">
        <div className="pb-5 mb-5 border-b border-gray-300/50">
          <h1 className="text-3xl">{name}</h1>
          <p>⭐ 4.9 (120 reseñas)</p>
          <h3 className="text-3xl mb-5">${price}</h3>
          {tags && (
            <div className="flex flex-wrap gap-0.5 text-sm font-semibold">
              {tags.split(",").map((tag, index) => (
                <>
                  <span className="text-amber-700" key={index}>
                    {tag.trim()}
                  </span>
                  {index < tags.split(",").length - 1 && <DotIcon />}
                </>
              ))}
            </div>
          )}
          <p className="text-gray-700">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-end gap-2 pb-5 mb-5 border-b border-gray-300/50">
          <button
            onClick={() => addToCart(product)}
            className="bg-amber-600 text-white px-6 py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg flex w-full sm:w-auto justify-center items-center gap-2"
          >
            <HandbagIcon className="group-hover:-translate-x-2 transition-all" />{" "}
            <span>Agregar al Carrito</span>
          </button>
          <button
            onClick={() => {
              addToCart(product);
              navigate("/checkout");
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition hover:shadow-lg flex w-full sm:w-auto justify-center items-center gap-2"
          >
            <CreditCardIcon className="group-hover:translate-x-2 transition-all" />
            <span>Pagar Ahora</span>
          </button>
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
                Hidrata profundamente y repara el cabello dañado, devolviendo
                brillo y suavidad naturales.
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
              <p className="font-semibold">🌿 Proteína de Queratina Natural</p>
              <p>
                Restaura la estructura capilar dañada, eliminando el frizz y
                proporcionando protección térmica.
              </p>
            </li>
            <li>
              <p className="font-semibold">✨ Vitamina E Antioxidante</p>
              <p>
                Protege contra los radicales libres y el daño ambiental, dejando
                el cabello resistente y radiante.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full mx-auto sm:w-9/12 md:w-8/12 lg:w-7/12 animate-pulse">
      <div className="mx-auto lg:mx-0 lg:max-w-lg">
        <div className="pb-5 mb-5 border-b border-gray-300/50">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-5" />
          <div className="h-5 bg-gray-200 rounded w-full mb-2" />
          <div className="h-5 bg-gray-200 rounded w-full mb-2" />
          <div className="h-5 bg-gray-200 rounded w-5/6 mb-2" />
        </div>
        <div className="flex flex-wrap items-end gap-5 pb-5 mb-5 border-b border-gray-300/50">
          <div>
            <div className="h-12 bg-gray-200 rounded w-48 mb-2" />
          </div>
          <div>
            <div className="h-12 bg-gray-200 rounded w-48 mb-2" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
            <div className="h-7 w-7 bg-gray-200 rounded-full" />
            <div className="h-5 bg-gray-200 rounded w-32" />
          </div>
          <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
            <div className="h-7 w-7 bg-gray-200 rounded-full" />
            <div className="h-5 bg-gray-200 rounded w-48" />
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-300/50">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="space-y-2">
            <div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-5 bg-gray-200 rounded w-full mb-1" />
            </div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-5 bg-gray-200 rounded w-full mb-1" />
            </div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-5 bg-gray-200 rounded w-full mb-1" />
            </div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-5 bg-gray-200 rounded w-full mb-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
