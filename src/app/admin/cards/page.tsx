import AdminLayout from "@/components/admin/AdminLayout";
import CardsManager from "@/components/admin/CardsManager";
import { getCardsWithStats } from "@/lib/analytics";
import { getBaseUrl } from "@/lib/baseUrl";

export const metadata = { title: "Business Cards — Mike Sport" };
export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const cards = await getCardsWithStats();
  return (
    <AdminLayout active="/admin/cards" title="Business Cards">
      <CardsManager initialCards={cards} baseUrl={getBaseUrl()} />
    </AdminLayout>
  );
}
