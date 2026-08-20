import { useEffect, useRef } from "react";

// MonkeyType-style auto-scroll: as the caret (the "current char" marker) wraps
// onto a new line, smoothly scroll the container so that line rises to the top.
// The container should be overflow-hidden (not overflow-auto) so it stays
// programmatically scrollable but never manually scrollable by the player.
export function usePromptAutoScroll(containerRef, markerRef, resetKey) {
  const lineTopRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = 0;
    lineTopRef.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    const container = containerRef.current;
    const marker = containerRef.current && markerRef.current;
    if (!container || !marker) return;
    const markerTop = marker.offsetTop;
    if (markerTop > lineTopRef.current) {
      container.scrollTo({ top: markerTop, behavior: "smooth" });
      lineTopRef.current = markerTop;
    }
  });
}
