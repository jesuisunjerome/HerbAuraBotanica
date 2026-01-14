export default function GradientBg() {
  return (
    <>
      <div className="block absolute top-0 left-0 w-80 h-80 bg-amber-100 rounded-full -z-10 opacity-70 blur-3xl"></div>
      <div className="block absolute top-20 left-60 w-32 h-32 bg-pink-200 rounded-full -z-10 opacity-70 blur-3xl"></div>
      <div className="block absolute top-0 left-1/2 w-32 h-32 bg-red-200 rounded-full -z-10 opacity-70 blur-3xl"></div>
      <div className="block absolute bottom-0 right-0 w-80 h-80 bg-green-100 rounded-full -z-10 opacity-70 blur-3xl"></div>
      <div className="block absolute bottom-20 right-60 w-32 h-32 bg-blue-200 rounded-full -z-10 opacity-70 blur-3xl"></div>
      <div className="block absolute bottom-0 right-1/2 w-32 h-32 bg-purple-200 rounded-full -z-10 opacity-70 blur-3xl"></div>
    </>
  );
}
