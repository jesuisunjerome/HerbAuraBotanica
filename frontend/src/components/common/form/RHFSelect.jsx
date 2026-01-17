import FormError from "./FormError";

export default function RHFSelect({
  label,
  id,
  options = [],
  error,
  register,
  disabled = false,
  required = false,
  helperText,
  labelSize = "base",
}) {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-2 font-medium text-${labelSize}`}
        >
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className="w-full border border-gray-300 rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={disabled}
          {...register(id)}
        >
          <option value="">Selecciona una opción</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {helperText && <small className="text-slate-500">{helperText}</small>}
      <FormError error={error} />
    </>
  );
}
