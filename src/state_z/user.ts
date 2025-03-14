import { create } from "zustand";
import { getAccessToken } from "../auth/authHelpers";

interface UserState {
  username: string;
  photo: string;
  userID: string;
  email: string;
  // ! get partial types
  // setUser: (user: Partial<UserState>) => void;
  getUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  username: "",
  photo: "",
  userID: "",
  email: "",
  // setUser: (user) => set((state) => ({ ...state, ...user })),
  getUser: async () => {
    try {
      // await new Promise((res) => setTimeout(() => res, 1000));

      const accessToken = getAccessToken();
      console.log(accessToken);

      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      const res = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No user or bad request");

      const user = await res.json();
      set({
        username: user.display_name,
        photo: user.images?.[0]?.url || "",
        userID: user.id,
        email: user.email,
      });

      return user;
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
}));
