import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../lib/store/provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/layout/auth-provider";
import Header from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Croper test",
  description: "Croper Tech Test - Sistema de gestión de productos",
  authors: [
    { name: "David Silgado", url: "https://github.com/dsilgadosalcedo" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} antialiased`}>
        <ReduxProvider>
          <Header />
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
