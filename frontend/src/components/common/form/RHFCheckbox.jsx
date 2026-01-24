import FormError from "./FormError";

export default function RHFCheckbox({
  id,
  error,
  register,
  disabled = false,
  children,
  ...props
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={id}
          className="h-4 w-4 rounded border-gray-300"
          disabled={disabled}
          {...props}
          {...register(id)}
        />
        {children && (
          <label htmlFor={id} className="block text-gray-700">
            {children}
          </label>
        )}
      </div>
      <FormError error={error} />
    </div>
  );
}
