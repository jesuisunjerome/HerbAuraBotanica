import { X } from "lucide-react";
import { MODAL_SIZES } from "../../lib/helper";

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

export function ModalHeader({ children, className, onClose }) {
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

export function ModalFooter({ className, children }) {
  return <div className={`modal-footer ${className}`}>{children}</div>;
}
