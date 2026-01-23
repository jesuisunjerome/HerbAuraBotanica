import { Link } from "react-router";

export default function NewsLetter() {
  return (
    <div className="max-w-lg pt-30 pb-20 mx-auto text-center">
      <h3 className="text-3xl font-semibold mb-1">
        ¡Suscríbete a nuestro boletín para las últimas actualizaciones y
        ofertas!
      </h3>
      <p className="text-gray-500">
        Únete a nuestra comunidad y sé el primero en conocer nuevos productos y
        ofertas exclusivas.
      </p>

      <form className="mt-4 mb-2 flex gap-2">
        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
        <button className="bg-[#3f6b4c] text-white px-4 py-2 rounded-md hover:bg-[#2e4d36]">
          Suscribirse
        </button>
      </form>

      <small>
        Respetamos tu privacidad. Desuscríbete en cualquier momento. Lee nuestra{" "}
        <Link className="text-amber-600" to="/privacy-policy">
          Política de Privacidad
        </Link>
        .
      </small>
    </div>
  );
}
