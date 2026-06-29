import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import CardForm from "@/components/CardForm";
import { getBaseUrl } from "@/lib/baseUrl";

export const metadata = { title: "New Card — Mike Sport" };
export const dynamic = "force-dynamic";

export default function NewCardPage() {
  return (
    <AdminLayout active="/admin/cards">
      <Link
        href="/admin/cards"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cards
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink-950">
        Create Business Card
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Fill in the employee details. The slug is auto-generated from the full
        name.
      </p>
      <div className="mt-6 max-w-3xl">
        <CardForm mode="create" baseUrl={getBaseUrl()} />
      </div>
    </AdminLayout>
  );
}
