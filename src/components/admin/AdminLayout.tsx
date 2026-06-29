import AdminShell from "@/components/admin/AdminShell";
import { getSettings } from "@/lib/settings";

/**
 * Server wrapper that loads dashboard settings (logo, title, accent) once and
 * passes them into the client AdminShell. Every admin page renders this.
 */
export default async function AdminLayout({
  active,
  title,
  children,
}: {
  active?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <AdminShell
      active={active}
      title={title}
      logoUrl={settings.logoUrl}
      dashboardTitle={settings.dashboardTitle}
      accentColor={settings.accentColor}
    >
      {children}
    </AdminShell>
  );
}
