import { useEffect, useState, useCallback } from "react";

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: string;
  disabled?: boolean;
}

export interface ContextMenuOptions {
  onShow?: (position: ContextMenuPosition) => void;
  onHide?: () => void;
  customItems?: ContextMenuItem[];
  preventDefault?: boolean;
}

export function useContextMenu(options: ContextMenuOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [contextData, setContextData] = useState<any>(null);

  const { onShow, onHide, customItems = [], preventDefault = true } = options;

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      // ! to prevent browser default context menu
      if (preventDefault) {
        event.preventDefault();
      }

      const newPosition = { x: event.clientX, y: event.clientY };
      setPosition(newPosition);
      setIsVisible(true);

      // Store any relevant data about what was right-clicked
      const target = event.target as HTMLElement;
      const trackId =
        target.closest("[data-track-id]")?.getAttribute("data-track-id") ||
        null;
      const playlistId =
        target
          .closest("[data-playlist-id]")
          ?.getAttribute("data-playlist-id") || null;

      setContextData({
        trackId,
        playlistId,
        target,
        element: target,
      });

      onShow?.(newPosition);
    },
    [preventDefault, onShow],
  );

  const hideContextMenu = useCallback(() => {
    setIsVisible(false);
    setContextData(null);
    onHide?.();
  }, [onHide]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const contextMenu = document.getElementById("global-context-menu");
      if (contextMenu && !contextMenu.contains(event.target as Node)) {
        hideContextMenu();
      }
    },
    [hideContextMenu],
  );

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideContextMenu();
      }
    },
    [hideContextMenu],
  );

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [handleContextMenu, handleClickOutside, handleEscapeKey]);

  return {
    isVisible,
    position,
    contextData,
    hideContextMenu,
  };
}
