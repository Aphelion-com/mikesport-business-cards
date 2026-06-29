import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Admin Login — Mike Sport" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-brand-50 px-4">
      <LoginForm />
    </main>
  );
}
