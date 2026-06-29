import LoginForm from "@/components/LoginForm";
import AnimatedBackground from "@/components/public/AnimatedBackground";
import { getSettingsSafe } from "@/lib/settings";

export const metadata = { title: "Admin Login — Mike Sport" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const settings = await getSettingsSafe();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4">
      <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-brand-500 to-gold" />
      <AnimatedBackground />
      <div className="relative w-full max-w-sm">
        <LoginForm logoUrl={settings.logoUrl} dashboardTitle={settings.dashboardTitle} />
      </div>
    </main>
  );
}
