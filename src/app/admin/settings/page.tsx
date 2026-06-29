import AdminLayout from "@/components/admin/AdminLayout";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Settings — Mike Sport" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <AdminLayout active="/admin/settings" title="Settings">
      <p className="-mt-3 mb-6 max-w-2xl text-sm text-slate-500">
        Customise the dashboard branding and company defaults. The logo appears
        in the sidebar and header; if none is set, the Mike Sport text logo is
        used.
      </p>
      <div className="max-w-3xl">
        <SettingsForm settings={settings} />
      </div>
    </AdminLayout>
  );
}
