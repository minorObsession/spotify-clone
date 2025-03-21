import { useStateStore } from "../state/store";

function UserAvatar() {
  const userPhoto = useStateStore((store) => store.user.photo);

  if (!userPhoto) return null;

  return (
    <img src={userPhoto} alt="user avatar" className={`w-8 rounded-2xl`} />
  );
}

export default UserAvatar;
