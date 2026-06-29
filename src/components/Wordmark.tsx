/**
 * Mike Sport text-logo fallback. Sporty uppercase wordmark with an orange
 * accent on "SPORT". Used in headers and footers where no image logo exists.
 */
export default function Wordmark({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={`font-sans text-base font-extrabold uppercase tracking-[0.25em] ${className}`}
    >
      <span className={onDark ? "text-white" : "text-ink-950"}>MIKE</span>
      <span className="text-brand-500"> SPORT</span>
    </span>
  );
}
