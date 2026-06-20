import { LockKeyhole } from "lucide-react";

type EmptyStateProps = {
  title: string;
  message: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-tealGlow/70 bg-white/82 p-8 text-center shadow-sm">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-seafoam/55 text-forest">
        <LockKeyhole size={24} aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-forest">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-moss">{message}</p>
    </div>
  );
}
