/** A redaction bar. Hover (or focus, when focusable) reveals the hidden text in red. */
export default function Redacted({
  children,
  dark = false,
  focusable = true,
}: {
  children: string;
  dark?: boolean;
  focusable?: boolean;
}) {
  return (
    <span
      tabIndex={focusable ? 0 : undefined}
      className={`redact ${dark ? "redact-dark" : ""}`}
      title="Redacted"
      aria-label={`Redacted: ${children}`}
    >
      {children}
    </span>
  );
}
