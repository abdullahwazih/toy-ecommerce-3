"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer for admin dashboard routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-white border-t border-black/5">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="text-lg font-extrabold tracking-tight text-slate-900">
              SunnySprout Toys
            </div>
            <p className="text-sm text-slate-600">
              Joyful, safe, and thoughtful toys for growing imaginations.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                Support: support@sunny-sprout.com
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Shop</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/all-toys" className="hover:text-emerald-700">
                  All Toys
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-700">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-emerald-700">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Account</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/login" className="hover:text-emerald-700">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-700">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-700">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Company</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-emerald-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#popular" className="hover:text-emerald-700">
                  Popular
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-emerald-700">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SunnySprout Toys. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/#privacy" className="hover:text-emerald-700">
              Privacy
            </Link>
            <Link href="/#terms" className="hover:text-emerald-700">
              Terms
            </Link>
            <Link href="/#support" className="hover:text-emerald-700">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

