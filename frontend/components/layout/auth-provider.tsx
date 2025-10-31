"use client";

import { useAuth } from "@/hooks/use-auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will trigger authentication on app start
  useAuth();

  return <>{children}</>;
}
