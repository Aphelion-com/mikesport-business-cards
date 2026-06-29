import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Admin Login — Mike Sport" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-500" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(249,115,22,0.6) 0 2px, transparent 2px 22px)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }}
      />
      <div className="relative">
        <LoginForm />
      </div>
    </main>
  );
}
