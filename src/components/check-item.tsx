"use client";

import { useOptimistic, useTransition } from "react";

/** A checkbox that saves itself through a server action as soon as it changes. */
export function CheckItem({
  id,
  checked,
  onToggle,
  children,
}: {
  id: string;
  checked: boolean;
  onToggle: (done: boolean) => Promise<void>;
  children: React.ReactNode;
}) {
  const [optimistic, setOptimistic] = useOptimistic(checked);
  const [pending, startTransition] = useTransition();

  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={optimistic}
        aria-busy={pending}
        onChange={(e) => {
          const done = e.target.checked;
          startTransition(async () => {
            setOptimistic(done);
            await onToggle(done);
          });
        }}
        className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)]"
      />
      <span className={optimistic ? "text-[var(--muted)] line-through decoration-[var(--accent)]" : ""}>{children}</span>
    </label>
  );
}
