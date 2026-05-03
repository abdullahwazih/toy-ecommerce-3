"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import API from "../lib/api";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const { setStatus, setRole } = useAuth(); // ✅ ADD ROLE
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      // 1. login (sets cookie)
      await API.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      // 2. fetch user info (VERY IMPORTANT)
      const res = await API.get("/auth/profile");
      const role = res.data.user.role;

      // 3. update global auth state
      setStatus("authed");
      setRole(role);

      // 4. redirect based on role
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { message?: string } } };
      setServerError(apiErr.response?.data?.message ?? "Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        <div className="p-7 sm:p-8 border-b border-white/10">
          <p className="text-xs font-semibold tracking-widest text-emerald-200/90">SUNNYSPROUT TOYS</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/70">Sign in to track orders and manage your cart.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-7 sm:p-8 grid gap-4">
          {serverError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {serverError}
            </div>
          )}

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-white/80">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
            {errors.email && <p className="text-sm text-red-200">{errors.email.message}</p>}
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-white/80">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
            {errors.password && <p className="text-sm text-red-200">{errors.password.message}</p>}
          </div>

          <button
            disabled={isSubmitting}
            className="mt-2 rounded-2xl bg-emerald-500/90 hover:bg-emerald-500 active:scale-[0.99] py-3 text-white font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-60 transition"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-sm text-white/70 text-center">
            New here?{" "}
            <Link href="/register" className="font-semibold text-emerald-200 hover:text-emerald-100">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
