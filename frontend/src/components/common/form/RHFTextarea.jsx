import FormError from "./FormError";

export default function RHFTextarea({
  label,
  id,
  placeholder,
  helperText,
  error,
  register,
  disabled = false,
  required = false,
  labelSize = "base",
  ...props
}) {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-2 text-gray-700 text-${labelSize}`}
        >
          {label} {required && <span className="text-red-400"> *</span>}
        </label>
      )}
      <textarea
        id={id}
        {...props}
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder={placeholder}
        disabled={disabled}
        {...register(id)}
      />
      {helperText && <small className="text-slate-500">{helperText}</small>}
      <FormError error={error} />
    </>
  );
}
