import { useState, useEffect, useRef } from "react";

const DOUBLE_CLICK_THRESHOLD = 300; // Maximum time between clicks for double click (ms)
const DRAG_START_DELAY = 100; // Delay before starting drag (ms)

export function usePhaseBarDrag(
  onStartMove?: (e: React.MouseEvent<HTMLElement>) => void,
  onDoubleClick?: (e: React.MouseEvent<HTMLElement>) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLElement>,
    handler?: (e: React.MouseEvent<HTMLElement>) => void
  ) => {
    e.stopPropagation();

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    // Clear any pending drag start
    if (dragStartTimeoutRef.current) {
      clearTimeout(dragStartTimeoutRef.current);
      dragStartTimeoutRef.current = null;
    }

    // Check if this is a double click (manual detection for faster response)
    if (
      timeSinceLastClick < DOUBLE_CLICK_THRESHOLD &&
      clickCountRef.current === 1
    ) {
      // This is a double click - execute immediately
      clickCountRef.current = 0;
      lastClickTimeRef.current = 0;

      // Cancel any active drag immediately
      isDraggingRef.current = false;
      setIsDragging(false);

      e.preventDefault();
      e.stopPropagation();

      // Execute double click handler immediately - no delay
      if (onDoubleClick) {
        onDoubleClick(e);
      }
      return;
    }

    // Single click - increment counter
    clickCountRef.current = 1;
    lastClickTimeRef.current = now;

    // Reset click count after threshold
    setTimeout(() => {
      if (clickCountRef.current === 1) {
        clickCountRef.current = 0;
      }
    }, DOUBLE_CLICK_THRESHOLD);

    // Start drag after a short delay (reduced for better responsiveness)
    if (handler) {
      dragStartTimeoutRef.current = setTimeout(() => {
        // Only start drag if still a single click (not cancelled by double click)
        if (clickCountRef.current === 1 && !isDraggingRef.current) {
          e.preventDefault(); // Prevent text selection
          isDraggingRef.current = true;
          setIsDragging(true);
          handler(e);
        }
      }, DRAG_START_DELAY);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Cancel any pending drag start immediately
    if (dragStartTimeoutRef.current) {
      clearTimeout(dragStartTimeoutRef.current);
      dragStartTimeoutRef.current = null;
    }

    // Reset click tracking
    clickCountRef.current = 0;
    lastClickTimeRef.current = 0;

    // Cancel any active drag
    isDraggingRef.current = false;
    setIsDragging(false);

    e.stopPropagation();
    e.preventDefault();

    // Execute double click handler immediately - no delay
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };

  const handleMouseUp = () => {
    // Reset dragging state on mouse up
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragStartTimeoutRef.current) {
        clearTimeout(dragStartTimeoutRef.current);
      }
    };
  }, []);

  // Add global mouseup listener to reset dragging state
  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    globalThis.addEventListener("mouseup", handleGlobalMouseUp, {
      passive: true,
    });
    return () => {
      globalThis.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  return {
    isDragging,
    handleMouseDown,
    handleDoubleClick,
    handleMouseUp,
  };
}

