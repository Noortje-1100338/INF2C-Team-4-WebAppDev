import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../ui/button/button";
import { FormError, ErrorIcon } from "../formError";
import "../auth.css";


type LoginErrors = {
    email?: string;
    password?: string;
}

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});

    function validate(email: string, password: string): LoginErrors {
        const e: LoginErrors = {};
        if (!email) e.email = "Email is verplicht";
        else if (!/^[\s\S]*@[\s\S]*\.[\s\S]*$/.test(email)) e.email = "Ongeldig emailadres";
        if (!password) e.password = "Wachtwoord is verplicht";
        return e;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const e = validate(email, password);
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        console.log({ email, password });
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="form-label-row">
                    <label htmlFor="email">Email</label>
                    <FormError message={errors.email} />
                </div>
                <div className="input-wrapper">
                    <input type="email" id="email" name="email" className={errors.email ? "input-error" : "" }      />
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
            <Button type="submit">Inloggen</Button>
        </form>
    );
}

export default LoginForm;