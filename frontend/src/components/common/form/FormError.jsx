export default function FormError({ error }) {
  if (!error) return null;

  return <p className="text-red-400 text-sm mt-1">{error.message}</p>;
}
