import type { ReactNode } from "react";
import Ecg from "./Ecg";

/** Waiting for the archive: a monitor still looking for a pulse. */
export function Retrieving({ what = "files" }: { what?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4" role="status">
      <Ecg className="h-16 w-full max-w-md text-ember" />
      <p className="label cursor !text-sm !text-bone">Retrieving {what}</p>
      <p className="label max-w-sm text-center !normal-case !tracking-normal">
        The archive sleeps when no one is watching. Waking it can take up to a minute.
      </p>
    </div>
  );
}

/** Error panel: a failed transmission. */
export function Failure({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="mx-auto my-16 max-w-xl border border-ember/50 bg-rust/20 p-6" role="alert">
      <p className="label !text-ember">Transmission failed</p>
      <p className="mt-3 font-typed text-lg text-bone">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
