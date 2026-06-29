import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CardForm from "@/components/CardForm";
import { getBaseUrl } from "@/lib/baseUrl";

export const metadata = { title: "New Card — Mike Sport" };

export default function NewCardPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        Create Business Card
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Fill in the employee details. The slug is auto-generated from the full
        name.
      </p>
      <div className="mt-6">
        <CardForm mode="create" baseUrl={getBaseUrl()} />
      </div>
    </main>
  );
}
