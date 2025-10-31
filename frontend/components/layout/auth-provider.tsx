"use client";

import { useAuth } from "@/hooks/use-auth";
import LoadingSpinner from "@/components/common/loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will trigger authentication on app start
  const { isLoading, isInitialized } = useAuth();

  // Show loading while authenticating on initial load
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  return <>{children}</>;
}
