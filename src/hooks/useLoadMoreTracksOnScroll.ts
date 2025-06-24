import { useEffect, useRef } from "react";

export function useLoadMoreTracksOnScroll(onTriggerLoadMore: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const didRunOnce = useRef(false);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        const entry = entries[0];
        if (entry.isIntersecting && didRunOnce.current) {
          onTriggerLoadMore();
          observer.unobserve(entry.target);
        }

        didRunOnce.current = true;
      },
      {
        root: null,
        rootMargin: "200px",
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  return sentinelRef;
}
