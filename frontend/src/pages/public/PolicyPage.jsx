import { useEffect } from "react";
import SEORender from "../../components/common/SEORender";
import NewsLetter from "../../components/public/catalog/NewsLetter";
import { RichText } from "../../components/public/terms/RichText";
import { highlightStyleWhenIdMatchesOnScroll } from "../../lib/helper";
import policyData from "../../lib/policyContent.json";

export default function PolicyPage() {
  const { menuItems, contentSections } = policyData;

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("div[id]");
      sections.forEach((section) => {
        highlightStyleWhenIdMatchesOnScroll(section.id);
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <SEORender
        title="Términos y Condiciones :: HerbAura Botanica"
        description="Lee los términos y condiciones de HerbAura Botanica. Información sobre compras, envíos, devoluciones y políticas de privacidad para una experiencia segura y confiable."
      />

      <header className="relative px-3 lg:px-20 md:px-5 h-90 pt-10 pb-20 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80"
          alt="Hierbas frescas"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-green-900/70 via-green-800/60 to-amber-900/70" />
        <h1 className="relative text-4xl lg:text-5xl font-bold text-center text-white drop-shadow-lg">
          Términos y Condiciones
        </h1>
      </header>

      <section className="px-3 lg:px-20 md:px-5 relative -top-30">
        <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto p-10 bg-white rounded-2xl shadow-lg shadow-gray-50">
          <div className="w-1/3 hidden md:flex flex-col gap-4 sticky top-30 self-start h-max">
            <div className="border-b border-gray-100 pb-3">
              <p className="uppercase font-semibold">Tabla de Contenidos</p>
            </div>
            <ul className="flex-1 overflow-auto space-y-3">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    className="menu-item text-gray-700 hover:text-amber-600 transition-colors block"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-2/3">
            <p className="mb-10">
              Bienvenido a HerbAura Botanica. Al acceder y utilizar nuestro
              sitio web, aceptas cumplir con los siguientes términos y
              condiciones. Por favor, lee atentamente esta información antes de
              realizar cualquier compra.
            </p>
            <div className="space-y-10">
              {contentSections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <p className="text-2xl font-medium">{section.title}</p>
                  </div>
                  <div className="space-y-2">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        <RichText paragraph={paragraph} />
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-3 py-20 lg:px-20 md:px-5 relative">
        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -top-4 left-0 h-8 w-full pointer-events-none"
          alt=""
        />
        <NewsLetter />
        <img
          loading="lazy"
          src="/images/vector.png"
          className="absolute -bottom-4 left-0 h-8 w-full z-10 pointer-events-none"
          alt=""
        />
        <div className="absolute top-0 right-0 w-40 h-40 -z-10 opacity-10 blur-3xl bg-amber-100 rounded-lg animate-pulse" />
      </section>
    </>
  );
}
