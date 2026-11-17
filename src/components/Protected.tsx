"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);
  if (loading) return <div className="p-10 text-center opacity-50">Loading...</div>;
  if (!user) return null;
  return <>{children}</>;
}