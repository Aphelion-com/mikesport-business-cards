import Wordmark from "@/components/Wordmark";

/**
 * Brand lockup: shows the configured logo image when available, otherwise a
 * clean text wordmark fallback ("MIKE SPORT" / dashboard title).
 */
export default function Brand({
  logoUrl,
  title,
  onDark = false,
  className = "",
  imgClassName = "h-8 w-auto",
}: {
  logoUrl?: string | null;
  title?: string | null;
  onDark?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={title || "Mike Sport"}
        className={`${imgClassName} ${className}`}
      />
    );
  }
  return <Wordmark onDark={onDark} className={className} />;
}
