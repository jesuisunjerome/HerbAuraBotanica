import { X } from "lucide-react";
import { MODAL_BUTTONS, MODAL_SIZES } from "../../lib/helper";

export function ModalWrapper({
  // eslint-disable-next-line no-unused-vars
  as: WrapperElement = "div",
  isOpen,
  size,
  children,
  ...props
}) {
  const sizeClass = MODAL_SIZES[size] || MODAL_SIZES.md;

  if (!isOpen) return null;

  return (
    <WrapperElement className="modal-wrapper" {...props}>
      <div className={`modal-dialog ${sizeClass}`}>
        <div className={`modal-content`}>{children}</div>
      </div>
    </WrapperElement>
  );
}

export function ModalHeader({ children, className = "", onClose }) {
  return (
    <div className={`modal-header ${className}`}>
      {children}

      {onClose && (
        <button type="button" onClick={onClose} className="btn-close-modal">
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children }) {
  return <div className="modal-body scroll-thin">{children}</div>;
}

export function ModalFooter({ className = "", children }) {
  return <div className={`modal-footer ${className}`}>{children}</div>;
}

export function ModalButton({
  mode = "",
  text = "",
  type = "button",
  onClick,
  disabled = false,
  children,
}) {
  let bgColor, textColor, bgHoverColor, ringColor;

  switch (mode) {
    case MODAL_BUTTONS.close:
    case MODAL_BUTTONS.cancel:
      bgColor = "bg-gray-200";
      textColor = "text-gray-900";
      bgHoverColor = "hover:bg-gray-300";
      ringColor = "focus:ring-gray-500";
      break;
    case MODAL_BUTTONS.delete:
      bgColor = "bg-red-600";
      textColor = "text-white";
      bgHoverColor = "hover:bg-red-700";
      ringColor = "focus:ring-red-500";
      break;
    case MODAL_BUTTONS.warning:
      bgColor = "bg-orange-600";
      textColor = "text-white";
      bgHoverColor = "hover:bg-orange-700";
      ringColor = "focus:ring-orange-500";
      break;
    case MODAL_BUTTONS.success:
      bgColor = "bg-green-600";
      textColor = "text-white";
      bgHoverColor = "hover:bg-green-700";
      ringColor = "focus:ring-green-500";
      break;
    default:
      bgColor = "bg-[#3f6b4c]";
      textColor = "text-white";
      bgHoverColor = "hover:bg-[#2e4d36]";
      ringColor = "focus:ring-[#3f6b4c]";
      break;
  }

  let buttonClass = `${bgColor} ${textColor} px-4 py-2 rounded-md ${bgHoverColor} focus:outline-none focus:ring-2 ${ringColor} focus:ring-offset-2 transition flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none`;

  return (
    <button
      disabled={disabled}
      type={type}
      className={buttonClass}
      onClick={onClick}
    >
      {children || text || mode || "Guardar"}
    </button>
  );
}
