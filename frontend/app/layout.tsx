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
  title: "Shopping Cart App",
  description: "Shopping Cart App - Manage items and shopping cart",
  authors: [
    { name: "Santiago Ricardo Ramirez", url: "https://github.com/DevRickyX" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
