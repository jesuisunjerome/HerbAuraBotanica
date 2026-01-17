export default function Banner() {
  return (
    <header className="px-3 lg:px-20 md:px-5">
      <div
        className="flex items-center min-h-95 py-5 px-10 rounded-3xl mb-10 relative overflow-hidden"
        style={{
          background: "url('/images/6.png') no-repeat center center",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-2xl text-white z-10">
          <h1
            className="text-4xl lg:text-5xl mb-5"
            style={{
              lineHeight: 1,
            }}
          >
            Descubre el poder de lo natural
          </h1>
          <p className="text-lg lg:text-xl">
            Explora nuestro catálogo de tratamientos botánicos diseñados para
            nutrir, fortalecer y realzar la esencia única de tu cabello.
          </p>
        </div>
        <div className="absolute inset-0 bg-linear-to-t  from-black/70 to-black/5"></div>
      </div>
    </header>
  );
}
