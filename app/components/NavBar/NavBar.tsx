"use client";

import AuthActions from "./AuthActions";
import Brand from "./Brand";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import { useAuth } from "../../context/AuthContext";
import { usePathname } from "next/navigation";


export default function Navbar() {
    const pathname = usePathname();
    const { role } = useAuth();

    // Hide the main site navbar for admin experience (admin routes + admin role)
    if (pathname.startsWith("/admin") || role === "admin") return null;

    return (
        <div className="navbar bg-white shadow-sm">

            {/* LEFT */}
            <div className="navbar-start">
                <MobileMenu />
                <Brand />
            </div>

            {/* CENTER */}
            <NavLinks />

            {/* RIGHT */}
            <div className="navbar-end">
                <AuthActions />
            </div>
        </div>
    );
}
