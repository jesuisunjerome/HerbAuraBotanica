export default function FormError({ error }) {
  if (!error) return null;

  return <p className="text-red-400 text-sm">{error.message}</p>;
}
