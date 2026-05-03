"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "../lib/api";

type AuthStatus = "guest" | "authed";
type Role = "user" | "admin" | null;

type AuthContextType = {
    status: AuthStatus;
    role: Role;
    setStatus: (status: AuthStatus) => void;
    setRole: (role: Role) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<AuthStatus>("guest");
    const [role, setRole] = useState<Role>(null);

    // ✅ run once on app load
    useEffect(() => {
        (async () => {
            try {
                const res = await API.get("/auth/profile");

                // 👇 IMPORTANT: adjust based on your backend response
                const user = res.data.user;

                setStatus("authed");
                setRole(user.role); // 👈 store role globally
            } catch {
                setStatus("guest");
                setRole(null);
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ status, role, setStatus, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}