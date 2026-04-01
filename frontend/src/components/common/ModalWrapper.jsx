import { X } from "lucide-react";
import { MODAL_BUTTONS, MODAL_SIZES } from "../../lib/helper";

export function ModalWrapper({
  as: Component = "div",
  isOpen,
  size,
  children,
  ...props
}) {
  const sizeClass = MODAL_SIZES[size] || MODAL_SIZES.md;

  if (!isOpen) return null;

  return (
    <Component className="modal-wrapper" {...props}>
      <div className={`modal-dialog ${sizeClass}`}>
        <div className={`modal-content`}>{children}</div>
      </div>
    </Component>
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
    case MODAL_BUTTONS.cancel:
      bgColor = "gray-200";
      textColor = "gray-900";
      bgHoverColor = "gray-300";
      ringColor = "gray-500";
      break;
    case MODAL_BUTTONS.close || MODAL_BUTTONS.cancel:
      bgColor = "gray-200";
      textColor = "gray-900";
      bgHoverColor = "gray-300";
      ringColor = "gray-500";
      break;
    case MODAL_BUTTONS.delete:
      bgColor = "red-600";
      textColor = "white";
      bgHoverColor = "red-700";
      ringColor = "red-500";
      break;
    case MODAL_BUTTONS.warning:
      bgColor = "orange-600";
      textColor = "white";
      bgHoverColor = "orange-700";
      ringColor = "orange-500";
      break;
    case MODAL_BUTTONS.success:
      bgColor = "green-600";
      textColor = "white";
      bgHoverColor = "green-700";
      ringColor = "green-500";
      break;
    default:
      bgColor = "[#3f6b4c]";
      textColor = "white";
      bgHoverColor = "[#2e4d36]";
      ringColor = "[#3f6b4c]";
      break;
  }

  let buttonClass = `bg-${bgColor} text-${textColor} px-4 py-2 rounded-md hover:bg-${bgHoverColor} focus:outline-none focus:ring-2 focus:ring-${ringColor} focus:ring-offset-2 transition flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none`;

  return (
    <button
      disabled={disabled}
      type={type}
      className={buttonClass}
      onClick={onClick}
    >
      {children ? children : <>{text || mode || "Guardar"}</>}
    </button>
  );
}
