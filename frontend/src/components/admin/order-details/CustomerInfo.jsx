import {
  Calendar1Icon,
  CreditCardIcon,
  TruckElectricIcon,
  UserIcon,
} from "lucide-react";

export default function CustomerInfo({ customer, shippingAddress, isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-bold">Información del Cliente</p>
      </div>
      {isPending ? (
        <CustomerInfoSkeleton />
      ) : (
        <div className="py-4 space-y-5">
          <div className="flex gap-2">
            <div className="p-2 bg-[#3f6b4c]/10 flex items-center justify-center rounded">
              <UserIcon className="h-5 w-6 text-[#3f6b4c]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight font-medium">
                Nombre
              </p>
              <p className="text-sm font-semibold leading-tight">
                {customer.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-[#3f6b4c]/10 flex items-center justify-center rounded">
              <Calendar1Icon className="h-5 w-6 text-[#3f6b4c]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight font-medium">
                Correo Electrónico
              </p>
              <p className="text-sm font-semibold leading-tight">
                {customer.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-[#3f6b4c]/10 flex items-center justify-center rounded">
              <CreditCardIcon className="h-5 w-6 text-[#3f6b4c]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight font-medium">
                Teléfono
              </p>
              <a
                href={`tel:${customer.phone}`}
                className="text-sm font-semibold text-[#3f6b4c] hover:underline leading-tight"
              >
                {customer.phone}
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-[#3f6b4c]/10 flex items-center justify-center rounded">
              <TruckElectricIcon className="h-5 w-6 text-[#3f6b4c]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight font-medium">
                Dirección de Envío
              </p>
              <p className="text-sm font-semibold leading-tight">
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.state}, C.P {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerInfoSkeleton() {
  return (
    <div className="py-4 space-y-5 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div className="flex gap-2" key={index}>
          <div className="p-2 bg-gray-50 flex items-center justify-center rounded">
            <div className="h-5 w-6 bg-gray-50 rounded"></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-50 rounded"></div>
            <div className="h-4 w-48 bg-gray-50 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
