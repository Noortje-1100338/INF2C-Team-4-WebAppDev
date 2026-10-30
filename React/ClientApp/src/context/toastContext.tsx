import { createContext, useCallback, useState, type ReactNode } from "react";
import ToastContainer from "../components/ui/toast/toast"

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    exiting?: boolean;
}

export interface ToastContextValue {
    showToast: (options: Omit<Toast, "id" | "exiting">) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const ANIMATION_DURATION = 300;

export function ToastProvider({ children } : { children: ReactNode }) {
    const [ toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true} : t ));
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, ANIMATION_DURATION)
    }, []);

    const showToast = useCallback((options: Omit<Toast, "id" | "exiting">) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { ...options, id }]);
        setTimeout(() => removeToast(id), 4000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    )


}