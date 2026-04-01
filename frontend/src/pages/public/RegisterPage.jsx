import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import RHFInput from "../../components/common/form/RHFInput";
import { useRegister } from "../../hooks/auth/mutations";
import { registerSchema } from "../../lib/schemas";

export default function RegisterPage() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { isRegistering, registerUser } = useRegister();
  const isDisabled = isRegistering || isSubmitting;

  const onSubmit = async (data) => {
    await registerUser(data);
  };

  return (
    <section className="flex gap-5">
      <div className="hidden md:block h-screen w-1/3 p-2">
        <div
          className="h-full flex gap-5 p-5 rounded-lg overflow-hidden relative"
          style={{
            background: "url('/images/img-5.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <a
            href="/"
            className="absolute top-4 left-4 text-lg font-bold text-gray-800 z-10"
          >
            <img
              src="/logos/logo.jpeg"
              alt="HerbAura Botánica Logo"
              className="h-20"
            />
          </a>

          <div className="mt-auto mb-5 z-10 text-white max-w-sm">
            <p className="text-4xl mb-2" style={{ lineHeight: 1 }}>
              Bienvenido a HerbAura Botánica
            </p>
            <p>Where herbs nurture your hair's aura.</p>
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-black/95 to-transparent" />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center px-4 py-20 md:py-4">
        <div className="w-full max-w-md space-y-6">
          <div className="md:hidden mb-7">
            <Link to="/">
              <img
                src="/logos/logo.png"
                alt="HerbAura Botánica Logo"
                className="h-20 mx-auto"
              />
            </Link>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold">Registrarse</h2>
            <p className="text-gray-600">
              Por favor, completa el formulario para crear una cuenta.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <RHFInput
                label="Nombre"
                id="name"
                required={true}
                register={register}
                error={errors.name}
                autoFocus
                disabled={isDisabled}
              />
            </div>
            <div>
              <RHFInput
                label="Correo"
                type="email"
                id="email"
                required={true}
                register={register}
                error={errors.email}
                disabled={isDisabled}
              />
            </div>
            <div>
              <RHFInput
                label="Contraseña"
                type="password"
                id="password"
                required={true}
                register={register}
                error={errors.password}
                disabled={isDisabled}
              />
            </div>
            <div className="mb-6">
              <RHFInput
                label="Confirmar Contraseña"
                type="password"
                id="confirmPassword"
                register={register}
                required={true}
                error={errors.confirmPassword}
                disabled={isDisabled}
              />
            </div>
            <button
              disabled={isDisabled}
              type="submit"
              className="flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5 w-full"
            >
              {isRegistering ? (
                <>
                  <LoaderCircleIcon className="w-5 h-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </button>
          </form>
          <div className="-mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-amber-600 hover:underline">
                Inicia sesión aquí
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
