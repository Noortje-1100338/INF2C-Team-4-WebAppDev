import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../ui/button/button";
import "../auth.css";

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        console.log({
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        });
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Naam</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Wachtwoord</label>
                <div className="input-wrapper">
                    <input type={showPassword ? "text" : "password"} id="password" name="password" required />
                    <button type="button" className="input-eye" onClick={() => setShowPassword(p => !p)} aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}>
                        {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                    </button>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                <div className="input-wrapper">
                    <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" required />
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