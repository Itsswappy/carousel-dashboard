"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
  { href: "/carousels", label: "Carousels" },
  { href: "/accounts", label: "Accounts" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const path = usePathname();
  const { user, signOut } = useUser();
  return (
    <nav className="border-b border-black/10 bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-lg">Carousel<span className="text-[#FFE600] bg-black px-1 ml-1 rounded">DB</span></Link>
        <div className="flex items-center gap-1 flex-wrap">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${path === l.href ? "bg-black text-white" : "hover:bg-black/5"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-50 hidden md:inline">{user?.email}</span>
          <button onClick={signOut} className="text-sm font-medium px-3 py-1.5 rounded-full border border-black/15 hover:bg-black hover:text-white transition-colors">Sign out</button>
        </div>
      </div>
    </nav>
  );
}