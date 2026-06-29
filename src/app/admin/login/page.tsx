import LoginForm from "@/components/LoginForm";
import { getSettingsSafe } from "@/lib/settings";

export const metadata = { title: "Admin Login — Mike Sport" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const settings = await getSettingsSafe();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal px-4">
      {/* Accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-brand-500" />

      {/* Animated soft shapes */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 animate-blob-1 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #f58220 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 animate-blob-2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #c99a4a 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 26px)",
        }}
      />

      <div className="relative">
        <LoginForm
          logoUrl={settings.logoUrl}
          dashboardTitle={settings.dashboardTitle}
        />
      </div>
    </main>
  );
}
