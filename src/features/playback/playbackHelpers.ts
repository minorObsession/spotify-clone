export const makeRequestBody = (
  uri: string,
  dataType: "artist" | "album" | "playlist" | "track",
  trackIndex: number,
) => {
  if (dataType === "track") {
    return JSON.stringify({
      uris: [uri],
      position: 0,
    });
  }
  return JSON.stringify({
    context_uri: uri,
    offset: { position: trackIndex },
    position_ms: 0,
  });
};
