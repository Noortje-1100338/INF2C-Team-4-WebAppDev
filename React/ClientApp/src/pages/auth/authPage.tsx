import { useState } from "react";
import LoginForm from "../../components/auth/login/loginForm";
import RegisterForm from "../../components/auth/register/registerForm";
import "./authPage.css";

type Tab = "login" | "register";

function AuthPage() {
    const [activeTab, setActiveTab] = useState<Tab>("login");
    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="auth-eyebrow">Hollowmere</p>
                <h1 className="auth-title">
                    {activeTab === "login" ? "Inloggen" : "Registreren"}
                </h1>
                <p className="auth-subtitle">
                    {activeTab === "login"
                        ? "Log in om verder te gaan."
                        : "Maak een nieuw account aan"}
                </p>

                <div className="auth-tabs">
                    <button type="button" className={`auth-tab ${activeTab === "login" ? "auth-tab--active" : ""}`} onClick={() => setActiveTab("login")}>Inloggen</button>
                    <button type="button" className={`auth-tab ${activeTab === "register" ? "auth-tab--active" : ""}`} onClick={() => setActiveTab("register")}>Registreren</button>
                </div>
                {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    )
}

export default AuthPage;