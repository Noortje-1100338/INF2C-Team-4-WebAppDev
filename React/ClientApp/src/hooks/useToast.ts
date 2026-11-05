import { useContext } from 'react';
import { ToastContext } from "../context/toastContext"

function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("UseToast moet binnen de ToastProvider")
    }
    return context;
}

export default useToast;