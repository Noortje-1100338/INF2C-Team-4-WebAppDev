import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

type AuthUser ={ name: string } | null;

type AuthContextType = {
    user: AuthUser;
    setUser: (user: AuthUser) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<AuthUser>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { me } = useAuth();

    useEffect(() => {
        me()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
    return ctx;
}