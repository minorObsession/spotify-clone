import { AccessTokenType } from "../features/auth/Auth";
import Cookies from "js-cookie";

export function flexibleMillisecondsConverter(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years}y ${days % 365}d`;
  } else if (months > 0) {
    return `${months}mo ${days % 30}d`;
  } else if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}min`;
  } else if (minutes > 0) {
    return `${minutes}min ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export const handleUploadToSpotify = async (
  playlistId: string,
  base64Image: string,
) => {
  const accessToken: AccessTokenType = JSON.parse(
    Cookies.get("accessToken") || "{}",
  );

  if (!accessToken.token)
    throw new Error("Access token expired or doesn't exist");

  const response = await fetch(
    "https://spotify-clone-2005.vercel.app/api/update-spotify-image",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId,
        base64Image,
        accessToken: `${accessToken.token}`,
      }),
    },
  );

  const data = await response.json();
  console.log(data);
};

// utils/placeholderImages.ts
export const getPlaceholderImage = (
  type:
    | "artist"
    | "album"
    | "playlist"
    | "podcast"
    | "episode"
    | "audiobook"
    | "track",
) => {
  const placeholders = {
    artist: "https://dummyimage.com/160x160/1DB954/FFFFFF&text=Artist",
    album: "https://dummyimage.com/160x160/FF6B35/FFFFFF&text=Album",
    playlist: "https://dummyimage.com/160x160/9B59B6/FFFFFF&text=Playlist",
    podcast: "https://dummyimage.com/160x160/E74C3C/FFFFFF&text=Podcast",
    episode: "https://dummyimage.com/160x160/F39C12/FFFFFF&text=Episode",
    audiobook: "https://dummyimage.com/160x160/27AE60/FFFFFF&text=Audiobook",
    track: "https://dummyimage.com/160x160/1DB954/FFFFFF&text=Track",
  };

  return placeholders[type];
};

// Helper function to get positioning classes based on direction
export const getPositioningClasses = (direction: string) => {
  switch (direction) {
    case "topLeft":
      return "bottom-2 -right-4"; // Above trigger, aligned to left
    case "topRight":
      return "bottom-2 -left-4"; // Above trigger, aligned to right
    case "bottomLeft":
      return "top-2 -left-20"; // Below trigger, aligned to left
    case "bottomRight":
      return "top-10 right-0"; // Use right-0 instead of negative
    case "extendToRight":
      return "-top-1 -right-60"; // Extend to right
    case "extendToLeft":
      return "-top-1 right-60"; // Extend to left
    default:
      return "bottom-2 -right-4"; // Default fallback
  }
};
