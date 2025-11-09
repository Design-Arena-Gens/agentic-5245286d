"use client";

import { AppDataProvider } from "@/context/AppDataContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppDataProvider>{children}</AppDataProvider>;
}

