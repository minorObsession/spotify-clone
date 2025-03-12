import { useSelector } from "react-redux";
import { RootState } from "../state/store";

function UserAvatar() {
  const userPhoto = useSelector((state: RootState) => state.user.photo);
  console.log(userPhoto);

  if (!userPhoto) return null;

  return (
    <img src={userPhoto} alt="user avatar" className={`w-8 rounded-2xl`} />
  );
}

export default UserAvatar;
