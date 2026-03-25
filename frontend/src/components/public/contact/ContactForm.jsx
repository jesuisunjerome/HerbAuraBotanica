import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { contactFormSchema } from "../../../lib/schemas";
import RHFInput from "../../common/form/RHFInput";
import RHFTextarea from "../../common/form/RHFTextarea";

export default function ContactForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-7">
      <div className="space-y-2 mb-6">
        <p className="text-2xl lg:text-3xl tracking-tighter">
          Envíanos un mensaje
        </p>
        <p className="text-gray-500">
          ¡Nos encantaría saber de ti! Por favor completa el formulario y te
          responderemos lo antes posible.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <RHFInput
            label="Nombre"
            id="name"
            required={true}
            register={register}
            error={errors.name}
          />
        </div>
        <div>
          <RHFInput
            label="Correo"
            id="email"
            required={true}
            register={register}
            error={errors.email}
            type="email"
          />
        </div>
        <div>
          <RHFTextarea
            label="Mensaje"
            id="message"
            required={true}
            register={register}
            error={errors.message}
            rows={5}
          />
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-white px-5 text-sm py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
        >
          Enviar{" "}
          <SendHorizonalIcon className="inline w-5 h-5 ml-2 group-hover:translate-x-2 transition-all" />
        </button>
      </div>
    </form>
  );
}
