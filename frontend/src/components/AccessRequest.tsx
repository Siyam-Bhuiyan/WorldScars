import { useState, type FormEvent } from "react";

/** "I don't have a clearance key": sends a request through a Netlify Form. */
export default function AccessRequest() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState(""); // honeypot: real people never fill this
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "access-request",
          "bot-field": trap,
          email: email.trim(),
          name: name.trim(),
          message: message.trim(),
        }).toString(),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="border border-ash p-5" role="status">
        <p className="label !text-bone">Request filed</p>
        <p className="mt-2 font-typed text-dim">
          The archivist has been told. If approved, your clearance key will be sent to {email.trim()}.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="btn w-full" onClick={() => setOpen(true)}>
        I don't have a clearance key: request one
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 border border-ash p-5">
      <p className="label !text-bone">Request clearance</p>
      <p className="font-typed text-sm text-dim">
        Tell the archivist who you are and what you want to file. If approved, a key will be sent to your email.
      </p>

      {/* honeypot, hidden from people */}
      <label className="sr-only" aria-hidden="true">
        Leave empty
        <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </label>

      <div>
        <label htmlFor="ar-email" className="label block">
          Your email <span className="text-blood">*</span>
        </label>
        <input id="ar-email" type="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
      </div>
      <div>
        <label htmlFor="ar-name" className="label block">
          Name
        </label>
        <input id="ar-name" className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
      </div>
      <div>
        <label htmlFor="ar-msg" className="label block">
          What would you like to file? <span className="text-blood">*</span>
        </label>
        <textarea id="ar-msg" required className="field min-h-[90px] resize-y" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} />
      </div>

      {state === "error" && (
        <p className="font-typed text-sm text-blood" role="alert">
          The request could not be sent. Try again in a moment.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-blood" disabled={state === "sending" || !email.trim() || !message.trim()}>
          {state === "sending" ? "Sending…" : "Send request"}
        </button>
        <button type="button" className="btn" onClick={() => setOpen(false)} disabled={state === "sending"}>
          Cancel
        </button>
      </div>
    </form>
  );
}
