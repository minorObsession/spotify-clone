import React, { useState } from "react";
import { createPortal } from "react-dom";
import EditPlaylistModal from "../components/EditPlaylistModal";
import { PartialPlaylist } from "../components/EditPlaylistModal";

export function useEditPlaylistModal() {
  const [isEditingPlaylist, setIsEditingPlaylist] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<PartialPlaylist | null>(null);

  const openEditModal = (playlist: PartialPlaylist) => {
    console.log("openEditModal");
    setSelectedPlaylist(playlist);
    setIsEditingPlaylist(true);
  };

  const closeEditModal = () => {
    setIsEditingPlaylist(false);
    setSelectedPlaylist(null);
  };

  const EditPlaylistModalPortal = () => {
    if (!isEditingPlaylist || !selectedPlaylist) return null;

    return createPortal(
      <EditPlaylistModal
        playlist={selectedPlaylist}
        isEditingPlaylist={isEditingPlaylist}
        setIsEditingPlaylist={closeEditModal}
      />,
      document.getElementById("root")!,
    );
  };

  return {
    isEditingPlaylist,
    selectedPlaylist,
    openEditModal,
    closeEditModal,
    EditPlaylistModalPortal,
  };
}
