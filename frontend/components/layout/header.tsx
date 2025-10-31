"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white border-dashed">
      <div className="container mx-auto py-4 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <Image
            src="/croper.png"
            alt="Croper"
            width={120}
            height={40}
            className="hidden sm:block h-10 w-auto"
            priority
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant={pathname === "/products" ? "default" : "outline"}>
              <Link href="/products">Productos</Link>
            </Button>
            <Button
              variant={pathname === "/products/create" ? "default" : "outline"}
            >
              <Link href="/products/create">Crear producto</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
