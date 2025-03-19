import { useUserStore } from "../state/user";

function UserAvatar() {
  const userPhoto = useUserStore((store) => store.photo);

  if (!userPhoto) return null;

  return (
    <img src={userPhoto} alt="user avatar" className={`w-8 rounded-2xl`} />
  );
}

export default UserAvatar;
