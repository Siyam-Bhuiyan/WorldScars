import type { ReactNode } from "react";

/** Full-width "retrieving files" state. */
export function Retrieving({ what = "files" }: { what?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <p className="label cursor !text-sm !text-bone">Retrieving {what}</p>
    </div>
  );
}

/** Error panel styled as a failed transmission. */
export function Failure({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="mx-auto my-16 max-w-xl border border-blood/60 bg-rust/20 p-6" role="alert">
      <p className="label !text-blood">Transmission failed</p>
      <p className="mt-3 font-typed text-lg text-bone">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
