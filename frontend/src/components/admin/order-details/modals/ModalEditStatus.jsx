import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateOrderStatus } from "../../../../hooks/orders/mutations";
import { MODAL_BUTTONS, ORDER_STATUS } from "../../../../lib/helper";
import RHFInput from "../../../common/form/RHFInput";
import RHFSelect from "../../../common/form/RHFSelect";
import RHFTextarea from "../../../common/form/RHFTextarea";
import { ModalWarningConfirmation } from "../../../common/ModalConfirmation";
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
} from "../../../common/ModalWrapper";

export default function ModalEditStatus({ data, onClose }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    values: data,
    resolver: zodResolver(schema),
  });

  const [modalConfirmation, setModalConfirmation] = useState(null);
  const [formData, setFormData] = useState(null);
  const onSubmit = (data) => {
    setFormData(data);
    setModalConfirmation(true);
  };

  const { isUpdatingStatus, updateOrderStatus } = useUpdateOrderStatus();
  const handleConfirm = async () => {
    if (formData) {
      const { updatedStatus, comment } = formData;
      setModalConfirmation(false);
      await updateOrderStatus(
        { orderId: data._id, updatedStatus, comment },
        {
          onSuccess: () => onClose(),
        },
      );
    }
  };

  if (modalConfirmation) {
    return (
      <ModalWarningConfirmation
        onClose={() => setModalConfirmation(false)}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <ModalWrapper as="form" onSubmit={handleSubmit(onSubmit)} isOpen={true}>
      <ModalHeader onClose={onClose}>
        <div>
          <h1 className="text-lg font-medium">Cambiar Estatus</h1>
          <p className="text-sm text-amber-600">{data.confirmationNumber}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <p className="text-gray-700">
            Aquí puedes forzar un cambio de estatus para este pedido. Ten
            cuidado, ya que esto puede afectar la experiencia del cliente si se
            hace incorrectamente.
          </p>
          <div>
            <RHFInput
              label="Estatus Actual"
              id="status"
              register={register}
              required={true}
              disabled
            />
          </div>
          <div>
            <RHFSelect
              label="Nuevo Estatus"
              id="updatedStatus"
              register={register}
              error={errors.updatedStatus}
              required={true}
              options={Object.values(ORDER_STATUS).map((status) => ({
                label: status,
                value: status,
              }))}
              disabled={isUpdatingStatus}
            />
          </div>
          <div>
            <RHFTextarea
              label="Comentario (opcional)"
              id="comment"
              register={register}
              disabled={isUpdatingStatus}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <ModalButton
          text="Cerrar"
          mode={MODAL_BUTTONS.close}
          onClick={onClose}
          disabled={isUpdatingStatus}
        />
        <ModalButton
          type="submit"
          text="Guardar"
          onClick={handleSubmit(onSubmit)}
          disabled={isUpdatingStatus}
        >
          {isUpdatingStatus ? (
            <>
              <LoaderCircleIcon className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : null}
        </ModalButton>
      </ModalFooter>
    </ModalWrapper>
  );
}

const schema = z.object({
  status: z
    .string()
    .min(1, "El estatus es obligatorio")
    .nonempty("El estatus es obligatorio")
    .trim(),
  updatedStatus: z
    .string()
    .min(1, "El nuevo estatus es obligatorio")
    .nonempty("El nuevo estatus es obligatorio")
    .trim(),
  comment: z.string().optional(),
});
