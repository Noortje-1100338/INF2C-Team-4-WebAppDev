import { useContext } from 'react';
import { ToastContext } from "../context/ToastContext"

function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("UseToast moet binnen de ToastProvider")
    }
    return context;
}

export default useToast;