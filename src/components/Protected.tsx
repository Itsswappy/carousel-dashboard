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
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        <span className="text-sm opacity-50">Loading…</span>
      </div>
    </div>
  );
  if (!user) return null;
  return <>{children}</>;
}