import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const transition = { duration: 0.15 };

export function FormError({ message }: { message?: string}) {
    return (
        <AnimatePresence>
            {message && (
                <motion.p className="form-error"
                initial={{ opacity: 0, x: 6 }}
                animate= {{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={transition}
                >
                    {message}
                </motion.p>
            )}
        </AnimatePresence>
    )
}

export function ErrorIcon({ show }: { show: boolean}) {
    return (
        <AnimatePresence>
            {show && (
                <motion.span className="input-icon-error"
                initial={{ opacity: 0, scale: 0.7}}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={transition}>
                    <AlertCircle size={16}/>

                </motion.span>
            )}
        </AnimatePresence>
    )
}