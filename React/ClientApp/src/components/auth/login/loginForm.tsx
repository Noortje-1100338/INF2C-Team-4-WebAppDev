import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../ui/button/button";
import "../auth.css";


function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        console.log({
            email: formData.get("email"),
            password: formData.get("password"),
        })
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
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
            <Button type="submit">Inloggen</Button>
        </form>
    );
}

export default LoginForm;