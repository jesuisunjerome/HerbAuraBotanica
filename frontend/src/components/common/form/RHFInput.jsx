import FormError from "./FormError";

export default function RHFInput({
  label,
  id,
  type = "text",
  placeholder,
  helperText,
  error,
  register,
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <>
      {label && (
        <label htmlFor={id} className="block mb-2 text-gray-700">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        {...register(id)}
      />
      {helperText && <small className="text-slate-500">{helperText}</small>}
      <FormError error={error} />
    </>
  );
}
