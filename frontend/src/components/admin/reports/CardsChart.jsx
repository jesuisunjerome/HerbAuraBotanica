import { useMemo } from "react";
import PaymentMethodsChart from "./PaymentMethodsChart";
import CustomerTypesChart from "./CustomerTypesChart";
import TopCategoriesChart from "./TopCategoriesChart";

export default function CardsChart({ isPending, salesReport }) {
    const paymentMethods = useMemo(() => salesReport?.paymentMethods || [], [salesReport]);
    const topCategories = useMemo(() => salesReport?.topCategories || [], [salesReport]);
    const customerTypes = useMemo(() => salesReport?.customerTypes || [], [salesReport]);

    return (
        <>
            <article className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4 md:col-span-2 2xl:col-span-1">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Ingresos por Método de Pago</h2>
                    <p className="text-xs text-gray-500 leading-tight">Distribución del dinero ingresado por cada pasarela de pago.</p>
                </div>
                {isPending ? (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-sm text-gray-500 animate-pulse">Cargando...</p>
                    </div>
                ) : <PaymentMethodsChart data={paymentMethods} />
                }
            </article>

            <article className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4 md:col-span-2 2xl:col-span-1">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Nuevos vs Recurrentes</h2>
                    <p className="text-xs text-gray-500 leading-tight">Proporción de ingresos de primera compra vs clientes fidelizados.</p>
                </div>
                {isPending ? (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-sm text-gray-500 animate-pulse">Cargando...</p>
                    </div>
                ) : <CustomerTypesChart data={customerTypes} />
                }
            </article>

            <article className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4 sm:col-span-2 md:col-span-4 2xl:col-span-2">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Rendimiento por Categoría</h2>
                    <p className="text-xs text-gray-500 leading-tight">Comparativa de unidades vendidas y su impacto financiero.</p>
                </div>

                {isPending ? (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-sm text-gray-500 animate-pulse">Cargando...</p>
                    </div>
                ) : (
                    <TopCategoriesChart data={topCategories} />
                )}
            </article>
        </>
    )
}