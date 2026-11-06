import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../ui/button/button";
import { FormError, ErrorIcon } from "../formError";
import "../auth.css";

type RegisterErrors = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>({});

    function validate(name: string, email: string, password: string, confirmPassword: string): RegisterErrors {
        const e: RegisterErrors = {};
        if (!name.trim()) e.name = "Naam is verplicht";
        else if (name.trim().length < 3) e.name = "Naam moet minimaal 3 tekens bevatten";
        if (!email) e.email = "Email is verplicht";
        else if (!/^[\s\S]*@[\s\S]*\.[\s\S]*$/.test(email)) e.email = "Ongeldig emailadres";
        if (!password) e.password = "Wachtwoord is verplicht";
        else if (password.length < 8) e.password = "Wachtwoord moet minimaal 8 tekens bevatten";
        if (!confirmPassword) e.confirmPassword = "Bevestig wachtwoord is verplicht";
        else if (confirmPassword !== password) e.confirmPassword = "Wachtwoorden komen niet overeen";
        return e;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        const e = validate(name, email, password, confirmPassword);
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        console.log({ name, email, password, confirmPassword });
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="form-label-row">
                    <label htmlFor="name">Naam</label>
                    <FormError message={errors.name} />
                </div>
                <div className="input-wrapper">
                    <input type="text" id="name" name="name" className={errors.name ? "input-error" : "" } />
                    <ErrorIcon show={!!errors.name} />
                </div>
            </div>
            <div className="form-group">
                <div className="form-label-row">
                    <label htmlFor="email">Email</label>
                    <FormError message={errors.email} />
                </div>
                <div className="input-wrapper">
                    <input type="email" id="email" name="email" className={errors.email ? "input-error" : "" } />
                    <ErrorIcon show={!!errors.email} />
                </div>
            </div>
            <div className="form-group">
                <div className="form-label-row">
                    <label htmlFor="password">Wachtwoord</label>
                    <FormError message={errors.password} />
                </div>
                <div className="input-wrapper">
                    <input type={showPassword ? "text" : "password"} id="password" name="password" className={errors.password ? "input-error" : "" } />
                    <button type="button" className="input-eye" onClick={() => setShowPassword(p => !p)} aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}>
                        {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                    </button>
                </div>
            </div>
            <div className="form-group">
                <div className="form-label-row">
                    <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                    <FormError message={errors.confirmPassword} />
                </div>
                <div className="input-wrapper">
                    <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" className={errors.confirmPassword ? "input-error" : "" } />
                    <button type="button" className="input-eye" onClick={() => setShowConfirmPassword(p => !p)} aria-label={showConfirmPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}>
                        {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                    </button>
                </div>
            </div>
            <Button type="submit">Registreren</Button>
        </form>
    )
}

export default RegisterForm;