export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-300 dark:bg-neutral-700 ${className}`}
    />
  );
}
