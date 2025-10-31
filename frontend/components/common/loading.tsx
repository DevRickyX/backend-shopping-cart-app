"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text = "Loading...",
  className = "",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-gray-500 mb-2`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function LoadingCard({
  title,
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent>
        <Loading text={title} />
      </CardContent>
    </Card>
  );
}

export function TableLoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  );
}
