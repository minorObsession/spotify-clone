import { Skeleton } from "./Skeleton";

function FooterSkeleton() {
  return (
    <footer className="grid-playback-l z-10 col-span-2 flex w-screen items-center justify-between gap-10 bg-amber-200 px-3 py-2">
      {/* // Left side - Currently Playing */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-14 w-14 rounded-md" />{" "}
        {/* Album image placeholder */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" /> {/* Song title */}
          <Skeleton className="h-3 w-20" /> {/* Artist name */}
        </div>
      </div>

      {/* // Center - Playback controls */}
      <div className="mx-auto flex flex-2 flex-col items-center justify-center gap-2">
        <div className="flex gap-2">
          {/* Playback buttons placeholders */}
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-8 w-8 rounded-full" />
          ))}
        </div>
        {/* Progress bar skeleton */}
        <Skeleton className="h-2 w-60 rounded-full" />
      </div>

      {/* // Right side - Volume and Queue */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <Skeleton className="h-6 w-6" /> {/* Queue icon */}
        <Skeleton className="h-2 w-28 rounded-full" /> {/* Volume slider */}
        <Skeleton className="h-6 w-6" /> {/* Queue icon duplicate */}
      </div>
    </footer>
  );
}

export default FooterSkeleton;
