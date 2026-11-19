export function useAuth() {
    async function login(email: string, password: string) {
        const response = await fetch("http://localhost:5043/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) throw new Error("Ongeldig Email of Wachtwoord");

        const data = await response.json();
        localStorage.setItem("token", data.token);
        return data;
    }

    async function register(name: string, email: string, password: string) {
        const response = await fetch("http://localhost:5043/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        })

        if (!response.ok) throw new Error("Registratie mislukt");

        const data = await response.json();
        localStorage.setItem("token", data.token);
        return data;
    }

    function logout() {
        localStorage.removeItem("token");
    }

    function getToken() {
        return localStorage.getItem("token");
    }

    return { login, register, logout, getToken };
}