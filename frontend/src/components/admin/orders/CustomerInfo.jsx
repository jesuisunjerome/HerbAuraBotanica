import {
  Calendar1Icon,
  CreditCardIcon,
  TruckElectricIcon,
  UserIcon,
} from "lucide-react";

export default function CustomerInfo({ user, isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-medium">Información del Cliente</p>
      </div>
      {isPending ? (
        <CustomerInfoSkeleton />
      ) : (
        <div className="py-4 space-y-5">
          <div className="flex gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <UserIcon className="h-5 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">Nombre</p>
              <p className="text-sm font-medium leading-tight">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <Calendar1Icon className="h-5 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">
                Correo Electrónico
              </p>
              <p className="text-sm font-medium leading-tight">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <CreditCardIcon className="h-5 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">Teléfono</p>
              <a
                href={`tel:${user.phone}`}
                className="text-sm font-medium leading-tight"
              >
                {user.phone}
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <TruckElectricIcon className="h-5 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">
                Dirección de Envío
              </p>
              <p className="text-sm font-medium leading-tight">
                {user.address}, {user.city}, {user.state}, C.P {user.postalCode}
                , {user.country}
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
