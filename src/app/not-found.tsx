import Link from "next/link";
import { SearchX } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { getSettingsSafe } from "@/lib/settings";

export const dynamic = "force-dynamic";

const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img {...p} alt={p.alt ?? ""} />
);

export default async function NotFound() {
  const settings = await getSettingsSafe();
  const emblemSrc = settings.cardEmblemUrl || settings.logoUrl || null;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper px-6 text-center">
      <div
        className="pointer-events-none absolute -left-28 top-[-80px] h-72 w-72 animate-blob-1 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #f1582b 0%, transparent 70%)" }}
      />
      <div className="relative w-full max-w-sm rounded-4xl border border-warmborder bg-white p-8 shadow-card">
        <div className="flex justify-center">
          {emblemSrc ? (
            <Img src={emblemSrc} alt="Mike Sport" className="h-9 w-auto max-w-[170px] object-contain" />
          ) : (
            <Wordmark />
          )}
        </div>
        <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full border border-warmborder bg-sand text-brand-600">
          <SearchX className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-graphite">
          Business card not found
        </h1>
        <p className="mt-2 text-sm text-muted">
          This digital business card doesn&rsquo;t exist. Please double-check the
          link.
        </p>
        {settings.companyWebsite ? (
          <a
            href={settings.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Visit Mike Sport
          </a>
        ) : (
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Go to homepage
          </Link>
        )}
      </div>
    </main>
  );
}
