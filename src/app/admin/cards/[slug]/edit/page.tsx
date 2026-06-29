import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import CardForm from "@/components/CardForm";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/baseUrl";

export const metadata = { title: "Edit Card — Mike Sport" };
export const dynamic = "force-dynamic";

export default async function EditCardPage({
  params,
}: {
  params: { slug: string };
}) {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) {
    notFound();
  }

  return (
    <AdminLayout active="/admin/cards">
      <Link
        href={`/admin/cards/${card.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to card
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink-950">
        Edit Business Card
      </h1>
      <p className="mt-1 text-sm text-slate-500">{card.fullName}</p>
      <div className="mt-6 max-w-3xl">
        <CardForm mode="edit" card={card} baseUrl={getBaseUrl()} />
      </div>
    </AdminLayout>
  );
}
