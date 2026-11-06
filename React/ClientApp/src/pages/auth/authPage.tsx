import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import LoginForm from "../../components/auth/login/loginForm";
import RegisterForm from "../../components/auth/register/registerForm";
import "./authPage.css";

type Tab = "login" | "register";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20},
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.08, duration: 0.4},
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10},
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function AuthPage() {
    const [activeTab, setActiveTab] = useState<Tab>("login");
    return (
        <div className="auth-page">
            <motion.div className="auth-card" variants={cardVariants} initial="hidden" animate="visible">
                <motion.p variants={itemVariants} className="auth-eyebrow">Hollowmere</motion.p>
                <motion.h1 variants={itemVariants} className="auth-title">
                    {activeTab === "login" ? "Inloggen" : "Registreren"}
                </motion.h1>
                <motion.p variants={itemVariants} className="auth-subtitle">
                    {activeTab === "login" ? "Log in om verder te gaan!" : "Maak een nieuw account aan"}
                </motion.p>

                <motion.div variants={itemVariants} className="auth-tabs">
                    <button type="button" className={`auth-tab ${activeTab === "login" ? "auth-tab--active" : ""}`} onClick={() => setActiveTab("login")}>
                        Inloggen
                        {activeTab === "login" && (
                            <motion.div className="auth-tab-indicator" layoutId="tab-indicator" />
                        )}
                    </button>

                    <button type="button" className={`auth-tab ${activeTab === "register" ? "auth-tab--active" : ""}`} onClick={() => setActiveTab("register")}>
                        Registreren
                        {activeTab === "register" && (
                            <motion.div className="auth-tab-indicator" layoutId="tab-indicator" />
                        )}
                    </button>
                </motion.div>
                
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 16}}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.32}}>
                        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default AuthPage;