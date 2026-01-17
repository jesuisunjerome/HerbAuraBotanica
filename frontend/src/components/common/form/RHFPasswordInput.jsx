import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import FormError from "./FormError";

export default function RHFPasswordInput({
  label,
  id,
  placeholder,
  helperText,
  error,
  register,
  disabled = false,
  required = false,
  labelSize = "base",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <>
      {label && (
        <label htmlFor={id} className={`mb-1 block text-${labelSize}`}>
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder={placeholder}
          disabled={disabled}
          {...register(id)}
        />
        <button
          onClick={togglePasswordVisibility}
          type="button"
          className="absolute top-2/4 right-3 z-10 -translate-y-2/4"
        >
          {showPassword ? (
            <EyeIcon className="h-5 w-5 text-slate-500" />
          ) : (
            <EyeSlashIcon className="h-5 w-5 text-slate-500" />
          )}
        </button>
      </div>
      {helperText && <small className="text-slate-500">{helperText}</small>}
      <FormError error={error} />
    </>
  );
}
