import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/baseUrl";
import Dashboard from "@/components/Dashboard";

export const metadata = { title: "Dashboard — Mike Sport" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cards = await prisma.card.findMany({ orderBy: { createdAt: "desc" } });
  return <Dashboard initialCards={cards} baseUrl={getBaseUrl()} />;
}
