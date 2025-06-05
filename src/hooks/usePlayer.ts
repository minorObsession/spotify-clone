import { useEffect } from "react";
import { useStateStore } from "../state/store";

export function usePlayer() {
  const {
    // Spotify Player state
    player,
    playerState,
    deviceId,
    isPlayerLoading,
    loadPlayer,
    cleanupPlayer,
    setPlayerState,

    // Playback controls
    currVolume,
    togglePlayback,
    seekToPosition,
    setVolume,
    playTrack,
    nextTrack,
    prevTrack,
  } = useStateStore((state) => state);

  // Auto-load player when component mounts
  useEffect(() => {
    loadPlayer();

    // Cleanup player when component unmounts
    return () => {
      cleanupPlayer();
    };
  }, [loadPlayer, cleanupPlayer]);

  // Update position every second when playing
  useEffect(() => {
    if (!playerState || playerState.paused) return;

    const interval = setInterval(() => {
      setPlayerState((prev) =>
        prev ? { ...prev, position: prev.position + 1000 } : prev,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState?.paused, playerState, setPlayerState]);

  return {
    // Player state
    player,
    playerState,
    deviceId,
    isPlayerLoading,
    currVolume,

    // Player controls
    togglePlayback,
    seekToPosition,
    setVolume,
    playTrack,
    nextTrack,
    prevTrack,
  };
}
