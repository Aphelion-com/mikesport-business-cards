"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
} from "lucide-react";
import Brand from "@/components/Brand";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/cards", label: "Business Cards", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminShell({
  active,
  title,
  logoUrl,
  dashboardTitle,
  accentColor,
  children,
}: {
  active?: string;
  title?: string;
  logoUrl?: string | null;
  dashboardTitle?: string | null;
  accentColor?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer on route change.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.replace("/admin/login");
    router.refresh();
  }

  const accent = accentColor || "#f97316";

  const navLinks = NAV.map((item) => ({
    ...item,
    act: active ? active === item.href : isActive(pathname, item.href, item.exact),
    Icon: item.icon,
  }));

  const SidebarContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-ink-950"
          style={{ backgroundColor: accent }}
        >
          MS
        </span>
        <Brand
          logoUrl={logoUrl}
          title={dashboardTitle}
          onDark
          imgClassName="h-7 w-auto max-w-[150px] object-contain"
          className="!text-sm"
        />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navLinks.map(({ href, label, act, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
              act
                ? "text-ink-950"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
            style={act ? { backgroundColor: accent } : undefined}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}

        <Link
          href="/admin/cards/new"
          className="mt-3 flex items-center gap-2 rounded-xl border border-white/15 px-3 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
        >
          <Plus className="h-4 w-4" style={{ color: accent }} />
          New Card
        </Link>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink-950 md:flex">
        {SidebarContent}
      </aside>

      {/* Mobile top header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-900 bg-ink-950 px-4 md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Brand
          logoUrl={logoUrl}
          title={dashboardTitle}
          onDark
          imgClassName="h-6 w-auto max-w-[140px] object-contain"
          className="!text-sm"
        />
        <Link
          href="/admin/cards/new"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-950"
          style={{ backgroundColor: accent }}
          aria-label="New card"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 animate-fade-in bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82%] animate-slide-in-left flex-col bg-ink-950">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {title && (
            <h1 className="mb-6 animate-fade-in-up text-2xl font-bold tracking-tight text-ink-950">
              {title}
            </h1>
          )}
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
