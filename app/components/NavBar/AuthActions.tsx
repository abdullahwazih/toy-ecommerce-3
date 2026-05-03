import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import API from "../../lib/api";
import Link from "next/link";

export default function AuthActions() {
  const { status, role, setStatus, setRole } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      await API.post("/auth/logout");
      setStatus("guest");
      setRole(null);
    } finally {
      setIsLoggingOut(false);
      router.push("/");
    }
  };

  if (status === "authed") {
    return (
      <div className="flex items-center gap-2">

        {/* 🛒 Cart icon (ONLY for non-admin users) */}
        {role !== "admin" && (
          <Link href="/cart" className="btn btn-ghost btn-sm">
            🛒 Cart
          </Link>
        )}

        {/* Dashboard */}
        {role === "admin" && (
          <Link href="/admin" className="btn btn-ghost btn-sm">
            Admin Dashboard
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="btn btn-outline btn-sm"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="btn btn-ghost btn-sm">
        Login
      </Link>
      <Link href="/register" className="btn btn-primary btn-sm">
        Register
      </Link>
    </div>
  );
}