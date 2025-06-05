import imageCompression from "browser-image-compression";

import { useRef, useState } from "react";
import { DetailedPlaylistType } from "../features/playlists/playlists";
import FloatingLabel from "./FloatingLabel";
import { useStateStore } from "../state/store";
import { useKeyPress } from "../hooks/useKeyPress";
import useOutsideClick from "../hooks/useOutsideClick";
import { saveToLocalStorage } from "../features/auth/authHelpers";

export type PartialPlaylist = Pick<
  DetailedPlaylistType,
  "id" | "name" | "imageUrl" | "description"
>;

interface EditPlaylistModalProps {
  playlist: PartialPlaylist;
  isEditingPlaylist: boolean;
  setIsEditingPlaylist: (isEditingPlaylist: boolean) => void;
  // refetchPlaylist: (skipCache?: boolean) => Promise<void>;
}

function EditPlaylistModal({
  playlist,
  setIsEditingPlaylist,
  isEditingPlaylist,
}: EditPlaylistModalProps) {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [newlySelectedImage, setNewlySelectedImage] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description,
    imageUrl: playlist.imageUrl,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useKeyPress("Escape", () => setIsEditingPlaylist(false));

  const modalRef = useOutsideClick<HTMLDialogElement>(() =>
    setIsEditingPlaylist(false),
  );

  const handleSubmitModifiedPlaylist = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const imageChanged =
      newlySelectedImage !== null && newlySelectedImage !== playlist.imageUrl;
    const nameChanged = formData.name !== playlist.name;
    const descriptionChanged = formData.description !== playlist.description;

    try {
      // if only image changed
      if (imageChanged) {
        // Send to Spotify
        const isUploadSuccessful = await useStateStore
          .getState()
          .uploadNewPlaylistImage(playlist.id, newlySelectedImage);

        if (!isUploadSuccessful)
          alert(
            "Failed to upload image, please try again.. any other changes will be saved",
          );

        // refetch the playlist so the image gets updated locally!
        // has to make an extra api call to get image from Spotify backend
        await useStateStore.getState().getPlaylist(playlist.id, 0, true);
      }

      // if name or description changed, but not image
      if (nameChanged || descriptionChanged) {
        const updatedFields = {
          ...playlist,
          name: formData.name,
          description: formData.description,
        };

        // hit api with a put request
        await useStateStore
          .getState()
          .updatePlaylistDetails(playlist.id, updatedFields);

        // * optimistic state update

        // Optimistically update playlist
        useStateStore.setState((state) => ({
          playlist: {
            ...state.playlist,
            name: updatedFields.name,
            description: updatedFields.description,
          },
        }));

        // update cache for playlist
        saveToLocalStorage(`playlist${playlist.id}`, updatedFields);

        // Optimistically update playlists
        useStateStore.setState((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlist.id
              ? {
                  ...p,
                  name: updatedFields.name,
                  desciption: updatedFields.description,
                }
              : { ...p },
          ),
        }));

        // update cache for playlists
        saveToLocalStorage(
          `${useStateStore.getState().user?.username}_playlists`,
          useStateStore.getState().playlists,
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      // close modal on form submit
      setIsEditingPlaylist(false);
    }
  };
  // todo: better alert if image is too large
  const handleFileChangeAndUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newImage = e.target.files?.[0];

    if (!newImage) return;

    try {
      const imageResizeOptions = {
        maxSizeMB: 0.0005, // max size in MB
        useWebWorker: true,
      };
      const compressedImage = await imageCompression(
        newImage,
        imageResizeOptions,
      );

      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);

      reader.onloadend = async () => {
        const base64DataUrl = reader.result as string;

        // Preview
        setFormData((prev) => ({
          ...prev,
          imageUrl: base64DataUrl,
        }));

        // Strip the prefix for Spotify
        const base64ImgString = base64DataUrl.replace(
          /^data:image\/jpeg;base64,/,
          "",
        );

        // check size of base64ImgString
        const sizeInKB = ((base64ImgString.length * 3) / 4 - 2) / 1024;
        console.log(sizeInKB, " KB");

        // if more than 256 KB, DON'T send to Spotify
        if (sizeInKB > 256) return alert("Image too large.. please try again");

        setNewlySelectedImage(base64ImgString);
        console.log("new image saved to state");
      };
    } catch (error) {
      console.error(error);
    }
  };

  if (!isEditingPlaylist) return null;

  return (
    <dialog
      ref={modalRef}
      className="h-fit-content absolute top-1/2 left-1/2 z-100 flex min-w-[30vw] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 bg-stone-400 p-4"
    >
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
          //  TODO add overlay pen image
          className={`max-h-[12rem] w-1/2 hover:cursor-pointer hover:brightness-75`}
          onClick={() => fileInputRef.current?.click()}
        />
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/jpg,image/jpeg"
          ref={fileInputRef}
          onChange={handleFileChangeAndUpload}
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
              value={formData.name}
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
              value={formData.description}
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
