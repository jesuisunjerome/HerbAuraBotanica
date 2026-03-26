import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import RHFInput from "../../components/common/form/RHFInput";
import FacebookButton from "../../components/public/login/FacebookButton";
import GoogleButton from "../../components/public/login/GoogleButton";
import { loginSchema } from "../../lib/schemas";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const { email, password } = data;
    await axios.post("/auth/login", { email, password });
    alert("Login local exitoso");
  };

  return (
    <section className="flex gap-5">
      <div className="h-screen w-1/3 p-2">
        <div
          className="h-full flex gap-5 p-5 rounded-lg overflow-hidden relative"
          style={{
            background: "url('/images/img-4.jpeg')",
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
              src="/logos/logo.png"
              alt="HerbAura Botánica Logo"
              className="h-20"
            />
          </a>

          <div className="mt-auto mb-5 z-10 text-white max-w-sm">
            <p className="text-4xl mb-2" style={{ lineHeight: 1 }}>
              Lorem, ipsum dolor.
            </p>
            <p>Where herbs nurture your hair's aura.</p>
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-black/95 to-transparent" />
        </div>
      </div>
      <div className="w-2/3 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Admin Login</h2>
            <p className="text-gray-600">
              Please enter your credentials to login.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-4">
              <RHFInput
                label="Email"
                type="email"
                id="email"
                register={register}
                required={true}
                errors={errors.email}
                autoFocus
              />
            </div>
            <div className="mb-6">
              <RHFInput
                label="Password"
                type="password"
                id="password"
                register={register}
                required={true}
                errors={errors.password}
              />
            </div>
            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5 w-full"
            >
              Login
            </button>
          </form>
          <div className="space-y-6">
            <p className="uppercase text-center">Or</p>
            <div className="grid md:grid-cols-2 gap-4">
              <GoogleButton />
              <FacebookButton />
            </div>
            <p className="text-sm text-gray-600 -mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-amber-600 hover:underline">
                Register here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
