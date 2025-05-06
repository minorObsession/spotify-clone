import { useState } from "react";
import { DetailedPlaylistType } from "../features/playlists/playlists";
import FloatingLabel from "./FloatingLabel";
type PartialPlaylist = Pick<
  DetailedPlaylistType,
  "id" | "name" | "imageUrl" | "description"
>;

interface EditPlaylistModalProps {
  playlist: PartialPlaylist;
  isEditingPlaylist: boolean;
  setIsEditingPlaylist: (isEditingPlaylist: boolean) => void;
}

function EditPlaylistModal({
  playlist,
  setIsEditingPlaylist,
}: EditPlaylistModalProps) {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  return (
    <dialog className="h-fit-content absolute top-1/2 left-1/2 z-100 flex min-w-[30vw] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 bg-stone-400 p-4">
      {/* // ! name and close */}
      <div className="flex items-center justify-between">
        <p>Edit details</p>
        <button onClick={() => setIsEditingPlaylist(false)}>&times;</button>
      </div>
      {/* // ! image and name/descr */}
      <div className="flex">
        <img src={playlist.imageUrl} className="max-h-[12rem] w-1/2" />
        <form className="flex w-full flex-col justify-between gap-5 px-2">
          <div className="relative">
            <input
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              type="text"
              defaultValue={playlist.name}
              className="h-10 w-full rounded-md border border-stone-600 bg-stone-400 p-2"
            />
            <FloatingLabel visible={isNameFocused} name="name" />
          </div>
          <div className="relative grow">
            <textarea
              onFocus={() => setIsDescriptionFocused(true)}
              onBlur={() => setIsDescriptionFocused(false)}
              defaultValue={playlist.description}
              className="h-full w-full rounded-md border border-stone-600 bg-stone-400 p-2"
            />
            <FloatingLabel visible={isDescriptionFocused} name="description" />
          </div>
        </form>
      </div>
      {/* // ! image and name/descr */}
      <button className="w-fit cursor-pointer self-end rounded-full bg-amber-500 px-5 py-1.5 transition duration-150 hover:contrast-125">
        Save
      </button>
    </dialog>
  );
}

export default EditPlaylistModal;
