import SEORender from "../../components/common/SEORender";
import NewsLetter from "../../components/public/catalog/NewsLetter";
import ContactForm from "../../components/public/contact/ContactForm";
import Gallery from "../../components/public/home/Gallery";

export default function ContactPage() {
  return (
    <>
      <SEORender
        title="Contacto :: HerbAura Botanica"
        description="Ponte en contacto con HerbAura Botanica para consultas sobre productos, pedidos o soporte. Estamos aquí para ayudarte en tu viaje de cuidado capilar natural."
      />

      <section className="px-3 lg:px-20 md:px-5 relative">
        <div
          className="flex flex-col lg:flex-row gap-10 items-center min-h-95 px-5 py-20 md:px-10 lg:p-10 rounded-3xl mb-10 relative overflow-hidden"
          style={{
            background: "url('/images/7.png') no-repeat center center",
            backgroundSize: "cover",
          }}
        >
          <div className="w-full md:w-[75%] lg:flex-1 text-white z-10">
            <div className="flex flex-col gap-10 lg:gap-30 max-w-lg">
              <div>
                <div className="mb-9">
                  <h1
                    className="text-4xl lg:text-5xl mb-3"
                    style={{
                      lineHeight: 1,
                    }}
                  >
                    ¿Tienes preguntas?
                  </h1>
                  <p className="text-4xl lg:text-5xl tracking-tighter">
                    Tenemos{" "}
                    <span
                      className="text-amber-600 relative"
                      style={{
                        fontFamily: "Playfair Display, serif",
                      }}
                    >
                      respuestas.
                      <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-500 rounded-lg animate-pulse"></span>
                    </span>
                  </p>
                </div>
                <p className="text-lg">
                  {/* En HerbAura Botanica, estamos comprometidos con ofrecerte la
                  mejor experiencia en cuidado capilar natural. Si tienes dudas sobre nuestros productos, ingredientes o
                  necesitas asesoramiento personalizado,  */}
                  Nuestro equipo está listo para ayudarte. Contáctanos y
                  descubre el poder de la naturaleza para tu cabello.
                </p>
              </div>
              <div className="mt-auto grid md:grid-cols-2 gap-7 text-gray-300">
                <div>
                  <p className="text-xl text-white">Correo</p>
                  <a
                    className="hover:underline"
                    href="mailto:info@herbaurabotanica.com"
                  >
                    info@herbaurabotanica.com
                  </a>
                </div>
                <div>
                  <p className="text-xl text-white">Teléfono</p>
                  <a className="hover:underline" href="tel:+525512345678">
                    +52 55 1234 5678
                  </a>
                </div>
                <div>
                  <p className="text-xl text-white">Redes Sociales</p>
                  <ul className="list list-none list-inside">
                    <li>
                      <a
                        className="hover:underline"
                        href="https://www.facebook.com/herbaurabotanica"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a
                        className="hover:underline"
                        href="https://www.instagram.com/herbaurabotanica"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a
                        className="hover:underline"
                        href="https://www.twitter.com/herbaurabotanica"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        TikTok
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[75%] lg:w-112.5 z-10">
            <ContactForm />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
        </div>
      </section>

      <Gallery />

      <section className="px-3 py-20 lg:px-20 md:px-5 relative">
        <NewsLetter />
        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -bottom-4 left-0 h-8 w-full z-10 pointer-events-none"
          alt="Decorative vector graphic"
        />
        <div className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-10 blur-3xl bg-amber-100 rounded-lg animate-pulse" />
      </section>
    </>
  );
}
