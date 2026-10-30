import { createPortal } from "react-dom";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X} from "lucide-react";
import type { Toast, ToastType } from "../../../context/ToastContext";
import "./toast.css";

const icons: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
}

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps ) {
    if (toasts.length === 0) return null;

    return createPortal(
        <div className="toast-container" role="region" aria-live="polite">
            {toasts.map((toast) => {
                const Icon = icons[toast.type];
                return (
                    <div key={toast.id} className={`toast toast--${toast.type}${toast.exiting ? " toast--exiting" : ""}`} role="alert">
                        <Icon className="toast-icon" size={20} strokeWidth={1.8} />
                        <div className="toast-body">
                            <p className="toast-title">{toast.title}</p>
                            {toast.message && <p className="toast-message">{toast.message}</p>}
                        </div>
                        <button type="button" className="toast-close"onClick={() => onDismiss(toast.id)} aria-label="Sluiten">
                            <X size={16} strokeWidth={1.8} />
                        </button>
                    </div>
                )
            })}
        </div>,
        document.body
    )
}

export default ToastContainer;