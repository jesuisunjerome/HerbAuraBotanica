import {
  CircleXIcon,
  LoaderIcon,
  PackageCheckIcon,
  TruckElectricIcon,
  UndoIcon,
  BanknoteIcon,
} from "lucide-react";
import { ORDER_STATUS } from "../../../lib/helper";

export default function OrderStatusBadge({ status }) {
  const statusStyles =
    status === ORDER_STATUS.DELIVERED
      ? {
          color: "text-[#3f6b4c]",
          icon: <PackageCheckIcon className="w-4 h-4" />,
        }
      : status === ORDER_STATUS.SHIPPED
        ? {
            color: "text-blue-600",
            icon: <TruckElectricIcon className="w-4 h-4" />,
          }
        : status === ORDER_STATUS.PROCESSING
          ? {
              color: "text-[#4b2e2e]",
              icon: <LoaderIcon className="w-4 h-4" />,
            }
          : status === ORDER_STATUS.RETURNED
            ? {
                color: "text-orange-600",
                icon: <UndoIcon className="w-4 h-4" />,
              }
            : status === ORDER_STATUS.REFUNDED
              ? {
                  color: "text-purple-600",
                  icon: <BanknoteIcon className="w-4 h-4" />,
                }
              : {
                  color: "text-rose-600",
                  icon: <CircleXIcon className="w-4 h-4" />,
                };

  return (
    <div className={statusStyles.color}>
      <p className="flex leading-tight items-center gap-1 font-semibold">
        {statusStyles.icon} {status}
      </p>
    </div>
  );
}
