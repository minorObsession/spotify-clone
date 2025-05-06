import imageCompression from "browser-image-compression";

import { useRef, useState } from "react";
import { DetailedPlaylistType } from "../features/playlists/playlists";
import FloatingLabel from "./FloatingLabel";
import { useStateStore } from "../state/store";
import { handleUploadToSpotify } from "../helpers/helperFunctions";

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
  isEditingPlaylist,
}: EditPlaylistModalProps) {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description,
    imageUrl: playlist.imageUrl,
  });

  const uploadNewPlaylistImage = useStateStore(
    (store) => store.uploadNewPlaylistImage,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitModifiedPlaylist = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // hit the API to update the playlist
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = e.target.files?.[0];

    if (!newImage) return;

    try {
      const reader = new FileReader();

      const imageResizeOptions = {
        maxSizeMB: 0.1, // max size in MB
        useWebWorker: true,
      };

      const compressedImage = await imageCompression(
        newImage,
        imageResizeOptions,
      );

      reader.readAsDataURL(newImage);

      console.log(compressedImage.size / 1024 / 1024 + " MB");

      // ! preview the uploaded iamge
      reader.onloadend = async () => {
        const base64DataUrl = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result as string, // shows the preview
        }));

        // Remove the data URL prefix
        const base64ImgString = base64DataUrl.replace(
          /^data:image\/jpeg;base64,/,
          "",
        );

        await handleUploadToSpotify(playlist.id, base64ImgString);
      };
    } catch (error) {
      console.error(error);
    }
  };

  if (!isEditingPlaylist) return null;

  return (
    <dialog className="h-fit-content absolute top-1/2 left-1/2 z-100 flex min-w-[30vw] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 bg-stone-400 p-4">
      {/* // ! name and close */}
      <div className="flex items-center justify-between">
        <p>Edit details</p>
        <button onClick={() => setIsEditingPlaylist(false)}>&times;</button>
      </div>
      {/* // ! image and name/descr */}
      <div className="flex">
        <img
          src={formData.imageUrl || playlist.imageUrl}
          alt="Playlist image"
          //  TODO: add overlay pen image
          className={`max-h-[12rem] w-1/2 hover:cursor-pointer hover:brightness-75`}
          onClick={() => fileInputRef.current?.click()}
        />
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/jpg,image/jpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <form
          onSubmit={handleSubmitModifiedPlaylist}
          className="flex w-full flex-col justify-between gap-5 px-2"
        >
          <div className="relative">
            <input
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              type="text"
              value={playlist.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-10 w-full rounded-md border border-stone-600 bg-stone-400 p-2"
            />
            <FloatingLabel visible={isNameFocused} name="name" />
          </div>
          <div className="relative grow">
            <textarea
              onFocus={() => setIsDescriptionFocused(true)}
              onBlur={() => setIsDescriptionFocused(false)}
              value={playlist.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              defaultValue={playlist.description}
              className="h-full w-full rounded-md border border-stone-600 bg-stone-400 p-2"
            />
            <FloatingLabel visible={isDescriptionFocused} name="description" />
          </div>
          <button className="w-fit cursor-pointer self-end rounded-full bg-amber-500 px-5 py-1.5 transition duration-150 hover:contrast-125">
            Save
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default EditPlaylistModal;
