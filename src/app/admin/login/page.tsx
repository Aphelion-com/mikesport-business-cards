import LoginForm from "@/components/LoginForm";
import AnimatedBackground from "@/components/public/AnimatedBackground";
import { getSettingsSafe } from "@/lib/settings";

export const metadata = { title: "Admin Login — Mike Sport" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const settings = await getSettingsSafe();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-10">
      {/* base warm floating shapes */}
      <AnimatedBackground />

      {/* richer accent mesh for the admin portal (warm orange + graphite depth) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-16 top-[-40px] h-80 w-80 animate-blob-1 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(241,88,43,0.14) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -right-20 bottom-[-60px] h-96 w-96 animate-blob-2 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(36,36,36,0.10) 0%, transparent 70%)" }}
        />
        <div
          className="absolute right-1/4 top-12 h-64 w-64 animate-blob-1 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(201,154,74,0.12) 0%, transparent 70%)" }}
        />
        <span className="absolute left-[14%] top-[26%] h-2 w-2 animate-float rounded-full bg-brand-500/25" />
        <span
          className="absolute right-[18%] top-[60%] h-1.5 w-1.5 animate-float rounded-full bg-gold/40"
          style={{ animationDelay: "1.4s" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <LoginForm logoUrl={settings.logoUrl} dashboardTitle={settings.dashboardTitle} />
      </div>
    </main>
  );
}
