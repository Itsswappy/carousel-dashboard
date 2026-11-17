"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";

export default function LoginPage() {
  const { signIn, signUp, configured } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (res.error) setErr(res.error.message);
    else router.replace("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border border-black/10 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Carousel Dashboard</h1>
        <p className="text-sm opacity-60 mb-6">
          {configured ? "Sign in to your workspace" : "Running in local mode (no Supabase configured)"}
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="email" className="border border-black/15 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="password" className="border border-black/15 rounded-lg px-3 py-2 text-sm"
          />
          {err && <div className="text-red-600 text-xs">{err}</div>}
          <button disabled={busy} className="bg-black text-white rounded-full h-10 font-semibold text-sm hover:bg-black/80 disabled:opacity-60">
            {busy ? "..." : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-xs opacity-60 hover:opacity-100"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        {!configured && (
          <button
            onClick={() => router.replace("/")}
            className="mt-2 text-xs opacity-60 hover:opacity-100 block"
          >
            Continue in local mode
          </button>
        )}
      </div>
    </div>
  );
}