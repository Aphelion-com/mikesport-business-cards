"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  LogOut,
  Plus,
} from "lucide-react";
import Wordmark from "@/components/Wordmark";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/cards", label: "Business Cards", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminShell({
  active,
  title,
  children,
}: {
  active?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.replace("/admin/login");
    router.refresh();
  }

  const navLinks = NAV.map((item) => {
    const act = active ? active === item.href : isActive(pathname, item.href, item.exact);
    const Icon = item.icon;
    return { ...item, act, Icon };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar (md+) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ink-950 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-extrabold text-ink-950">
            MS
          </span>
          <Wordmark onDark className="!text-sm" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navLinks.map(({ href, label, act, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                act
                  ? "bg-brand-500 text-ink-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}

          <Link
            href="/admin/cards/new"
            className="mt-3 flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold text-white transition hover:border-brand-500 hover:bg-white/5"
          >
            <Plus className="h-4 w-4 text-brand-500" />
            New Card
          </Link>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 bg-ink-950 md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Wordmark onDark className="!text-sm" />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-3 py-2">
          {navLinks.map(({ href, label, act, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                act ? "bg-brand-500 text-ink-950" : "bg-white/5 text-slate-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {title && (
            <h1 className="mb-6 text-2xl font-bold tracking-tight text-ink-950">
              {title}
            </h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
