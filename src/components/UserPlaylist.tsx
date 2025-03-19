import RecenThumbnail from "./RecentThumbnail";

function UserPlaylist({ name, images, id }: Playlist) {
  // console.log(images);

  return (
    <div
      className="grid grid-cols-[1fr_2fr] grid-rows-[2fr_1fr] gap-2 truncate p-1 text-sm"
      onClick={() => {}}
    >
      <RecenThumbnail img={images[0].url} />
      <p className="text-xs sm:text-sm">{name}</p>
      <p>{}</p>
    </div>
  );
}

export default UserPlaylist;
