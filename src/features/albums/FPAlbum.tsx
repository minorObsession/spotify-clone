import { memo } from "react";
import BackToHomeButton from "../../components/BackToHomeButton";
import { useLoaderData } from "react-router-dom";
import { createLoader } from "../../state/helpers";
import FPControls from "../../components/FPControls";
import { AlbumType } from "./album";
import FPAlbumOverview from "./FPAlbumOvewview";
import FPAlbumTracks from "./FPAlbumTracks";
import { useStateStore } from "../../state/store";

function FullPreviewAlbum() {
  const album = useLoaderData() as AlbumType;
  // const getAlbum = useStateStore((state) => state.getAlbum);

  return (
    <div className={`fullPreviewContainer gap-3`}>
      <BackToHomeButton />

      <FPAlbumOverview data={album} />

      {/* // ! album options same as playlist options */}
      <FPControls item={album} previewType="album" options={[]} />
      <FPAlbumTracks tracks={album.tracks} />
    </div>
  );
}

export default memo(FullPreviewAlbum);

const getAlbum = useStateStore.getState().getAlbum;

export const albumLoader = createLoader<AlbumType>("album", getAlbum);
