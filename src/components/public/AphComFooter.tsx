/**
 * Premium powered-by footer with animated AphCom gradient wordmark.
 */
export default function AphComFooter({ company }: { company?: string | null }) {
  const year = new Date().getFullYear();
  return (
    <div className="footer-content-bottom mt-7">
      <p className="footer-copyright">
        © {year} {company || "Mike Sport"}. All rights reserved.
      </p>
      <a
        href="https://aphcom.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Powered by AphCom — opens aphcom.com in a new tab"
        className="aphcom-link"
      >
        <span>Powered by</span>
        <span className="aphcom-word aphcom-animated">AphCom</span>
      </a>
    </div>
  );
}
