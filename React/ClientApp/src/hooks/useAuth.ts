export interface AuthUser {
    id: number;
    name: string;
    trained: boolean;
    quartermaster: boolean;
}

export function useAuth() {
    async function login(email: string, password: string): Promise<AuthUser> {
        const response = await fetch("http://localhost:5043/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) throw new Error("Ongeldig Email of Wachtwoord");
        return await response.json();
    }

    async function register(name: string, email: string, password: string): Promise<AuthUser> {
        const response = await fetch("http://localhost:5043/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ name, email, password })
        })

        if (!response.ok) throw new Error("Registratie mislukt");
        return await response.json();
    }

    async function logout() {
        await fetch("http://localhost:5043/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
    }

    async function me(): Promise<AuthUser> {
        const response = await fetch("http://localhost:5043/api/auth/me", {
            credentials: "include"
        });
        if (!response.ok) throw new Error("Niet ingelogd");
        return await response.json();}

    return { login, register, logout, me };
}