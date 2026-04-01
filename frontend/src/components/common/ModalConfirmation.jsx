import { CircleAlertIcon, CircleCheckBigIcon, Trash2Icon } from "lucide-react";
import { MODAL_BUTTONS } from "../../lib/helper";
import { ModalBody, ModalButton, ModalWrapper } from "./ModalWrapper";

export function ModalDeleteConfirmation({
  title,
  message,
  onClose,
  onConfirm,
}) {
  return (
    <ModalWrapper isOpen={true}>
      <ModalBody>
        <div className="size-15 mx-auto flex mt-5 items-center justify-center text-red-600 p-3 rounded-full bg-red-50">
          <Trash2Icon className="h-7 w-7" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-lg font-medium mb-1">{title || "Eliminar"}</h2>
          <p className="text-gray-600 mb-6">
            {message ||
              "Esta acción no se puede deshacer. Por favor, confirma que deseas continuar."}
          </p>
          <div className="flex justify-center gap-2">
            <ModalButton mode={MODAL_BUTTONS.cancel} onClick={onClose} />
            <ModalButton mode={MODAL_BUTTONS.delete} onClick={onConfirm} />
          </div>
        </div>
      </ModalBody>
    </ModalWrapper>
  );
}

export function ModalWarningConfirmation({
  title,
  message,
  onClose,
  onConfirm,
}) {
  return (
    <ModalWrapper isOpen={true}>
      <ModalBody>
        <div className="size-15 mx-auto flex mt-5 items-center justify-center text-orange-600 p-3 rounded-full bg-orange-50">
          <CircleAlertIcon className="h-7 w-7" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-lg font-medium mb-1">{title || "Advertencia"}</h2>
          <p className="text-gray-600 mb-6">
            {message ||
              "Esta acción requiere tu atención. Por favor, confirma que deseas continuar."}
          </p>
          <div className="flex justify-center gap-2">
            <ModalButton mode={MODAL_BUTTONS.cancel} onClick={onClose} />
            <ModalButton mode={MODAL_BUTTONS.warning} onClick={onConfirm} />
          </div>
        </div>
      </ModalBody>
    </ModalWrapper>
  );
}

export function ModalSuccessConfirmation({ title, message, onClose }) {
  return (
    <ModalWrapper isOpen={true}>
      <ModalBody>
        <div className="size-15 mx-auto flex mt-5 items-center justify-center text-green-600 p-3 rounded-full bg-green-50">
          <CircleCheckBigIcon className="h-7 w-7" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-lg font-medium mb-1">{title || "Éxito"}</h2>
          <p className="text-gray-600 mb-6">
            {message || "La acción se completó con éxito."}
          </p>
          <div className="flex justify-center gap-2">
            <ModalButton mode={MODAL_BUTTONS.close} onClick={onClose} />
          </div>
        </div>
      </ModalBody>
    </ModalWrapper>
  );
}
