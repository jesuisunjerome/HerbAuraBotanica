import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-20 px-3 md:px-5 lg:px-20 relative overflow-hidden">
      <div className="flex gap-10 mb-5 pb-15 border-b border-gray-100/50 flex-col md:flex-row">
        <div className="max-w-md mx-auto md:mx-0 text-center md:text-start">
          <h3 className="text-3xl italic mb-1 text-white!">
            HerbAura Botanica
          </h3>
          <p className="text-2xl">Where herbs nuture your hair's aura.</p>
        </div>
        <div className="mx-auto lg:mx-0 lg:ms-auto flex gap-10 items-center">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              href={href}
              key={label}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center gap-1 hover:text-white transition-all hover:underline"
              // className="size-13 flex items-center bg-[#4b2626] hover:bg-(--color-beige) hover:text-(--color-brown) justify-center rounded-full hover:-translate-y-0.5 transition-all"
            >
              <Icon className="w-5 h-5" />
              <span className="sr-only">{label}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="opacity-80 pt-5 pb-10 px-3 lg:px-20 md:px-5 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} HerbAura Botanica. Todos los
          derechos reservados.
        </p>
      </div>

      <h3
        className="text-[15rem]  text-white opacity-8 -bottom-25 right-1/2 translate-x-1/2 absolute select-none pointer-events-none"
        style={{
          letterSpacing: ".03em",
          fontFamily: "Playfair Display, serif",
        }}
      >
        HerbAura
      </h3>
    </footer>
  );
}

const socialLinks = [
  {
    href: "https://www.facebook.com/HerbAuraBotanica",
    label: "Facebook",
    icon: FacebookIcon,
  },
  {
    href: "https://www.instagram.com/HerbAuraBotanica",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://www.twitter.com/HerbAuraBotanica",
    label: "Twitter",
    icon: TwitterIcon,
  },
];
