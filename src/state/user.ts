import { getFromLocalStorage } from "../auth/authHelpers";
import { AccessTokenType } from "./Auth.z";
import { StateStore } from "./store";
import { StateCreator } from "zustand";

export interface UserType {
  username: string;
  photo: string;
  userID: string;
  email: string;
}
export interface UserSlice {
  // ! get partial types
  user: UserType | null;
  getUser: () => Promise<void>;
}

export const createUserSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => ({
  user: null,
  getUser: async () => {
    try {
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // ! check LS for user
      // * potential problem if switched to different user - need a better validation
      const storedUser = getFromLocalStorage<UserType>("user");

      if (storedUser) {
        set({ user: storedUser });
        return;
      }

      // ! if not in LS, then fetch user
      console.log("🛜 getUser will call api...");
      const res = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No user or bad request");

      const data = await res.json();

      const userObject: UserType = {
        username: data.display_name,
        photo: data.images?.[0]?.url || "",
        userID: data.id,
        email: data.email,
      };

      set({ user: userObject });

      // ! store user in LS

      localStorage.setItem("user", JSON.stringify(userObject));

      return data;
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
});
