import { useEffect, useRef } from "react";

export function useLoadMoreTracksOnScroll(
  onTriggerLoadMore: () => void,
  // tracks: TrackType[],
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onTriggerLoadMore();
      },
      {
        rootMargin: "200px", // optional: trigger slightly before
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [onTriggerLoadMore, sentinelRef]);

  if (sentinelRef.current) return sentinelRef;
}
