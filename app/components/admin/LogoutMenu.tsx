"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function LogoutMenu() {
  const router = useRouter();
  const { setStatus, setRole } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      await API.post("/auth/logout");
      setStatus("guest");
      setRole(null);
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <li>
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="is-drawer-close:tooltip is-drawer-close:tooltip-right w-full"
        data-tip="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
          className="my-1.5 inline-block size-4"
        >
          <path d="M10 8v-2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" />
          <path d="M15 12H3" />
          <path d="M6 9l-3 3l3 3" />
        </svg>

        <span className="is-drawer-close:hidden">
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
      </button>
    </li>
  );
}

