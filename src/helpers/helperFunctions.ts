import { AccessTokenType } from "../features/auth/Auth";
import { getFromLocalStorage } from "../features/auth/authHelpers";

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
  const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
  if (!accessToken) throw new Error("Access token expired or doesn't exist");

  const response = await fetch(
    "https://spotify-clone-2005.vercel.app/api/update-spotify-image",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId,
        base64Image,
        accessToken: `${accessToken?.token}`,
      }),
    },
  );

  const data = await response.json();
  console.log(data);
};
