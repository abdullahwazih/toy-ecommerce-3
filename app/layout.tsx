import type { Metadata } from "next";

import "./globals.css";
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import Providers from "./provider/TS-Provider";

export const metadata: Metadata = {
  title: "SunnySprout Toys",
  description:
    "Joyful, safe, and thoughtful toys for growing imaginations — shop by age, explore best sellers, and find the perfect gift.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gradient-to-b from-white to-emerald-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950">

        <AuthProvider>
          <Providers>
            <header className="sticky top-0 z-50">
              <Navbar />
            </header>
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>

        </AuthProvider>

      </body>
    </html>
  );
}
