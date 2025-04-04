import { StateCreator } from "zustand";
import { getFromLocalStorage } from "../auth/authHelpers";
import { StateStore } from "../../state/store";
import { AccessTokenType } from "../auth/Auth";

export interface UserType {
  username: string;
  photo: string;
  userID: string;
  email: string;
}
export interface UserSlice {
  // ! get partial types
  user: UserType | null;
  getUser: () => Promise<UserType>;
  getUserSavedTracks(): Promise<any>;
}

export const createUserSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => ({
  user: null,
  getUser: async (): Promise<UserType> => {
    try {
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // ! check LS for user
      // * potential problem if switched to different user - need a better validation
      const storedUser = getFromLocalStorage<UserType>("user");

      if (storedUser) {
        set({ user: storedUser });
        return storedUser;
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

      return userObject;
    } catch (err) {
      console.error("🛑 ❌", err);
      return {
        username: "",
        photo: "",
        userID: "",
        email: "",
      };
    }
  },
  getUserSavedTracks: async (): Promise<any> => {
    try {
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // // ! check LS for user
      // // * potential problem if switched to different user - need a better validation
      // const storedUser = getFromLocalStorage<UserType>("user");

      // if (storedUser) {
      //   set({ user: storedUser });
      //   return storedUser;
      // }

      // ! if not in LS, then fetch user
      console.log("🛜 getUser will call api...");
      const res = await fetch(
        "https://api.spotify.com/v1/me/shows?offset=0&limit=20",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("No user or bad request");

      const data = await res.json();
      console.log(data);
      // const userObject: UserType = {
      //   username: data.display_name,
      //   photo: data.images?.[0]?.url || "",
      //   userID: data.id,
      //   email: data.email,
      // };

      // set({ user: userObject });

      // ! store user in LS

      // localStorage.setItem("user", JSON.stringify(userObject));

      // return userObject;
      return;
    } catch (err) {
      console.error("🛑 ❌", err);
      return {
        username: "",
        photo: "",
        userID: "",
        email: "",
      };
    }
  },
  // getUsersSavedArtists: async (): Promise<any> => {
  //   try {
  //     const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
  //     if (!accessToken)
  //       throw new Error("Access token expired or doesn't exist");

  //     // ! check LS for user
  //     // * potential problem if switched to different user - need a better validation
  //     const storedUser = getFromLocalStorage<UserType>("user");

  //     if (storedUser) {
  //       set({ user: storedUser });
  //       return storedUser;
  //     }

  //     // ! if not in LS, then fetch user
  //     console.log("🛜 getUser will call api...");
  //     const res = await fetch(
  //       "https://api.spotify.com/v1/me/shows?offset=0&limit=20",
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${accessToken.token}`,
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );

  //     if (!res.ok) throw new Error("No user or bad request");

  //     const data = await res.json();
  //     console.log(data);
  //     // const userObject: UserType = {
  //     //   username: data.display_name,
  //     //   photo: data.images?.[0]?.url || "",
  //     //   userID: data.id,
  //     //   email: data.email,
  //     // };

  //     // set({ user: userObject });

  //     // ! store user in LS

  //     // localStorage.setItem("user", JSON.stringify(userObject));

  //     // return userObject;
  //     return;
  //   } catch (err) {
  //     console.error("🛑 ❌", err);
  //     return {
  //       username: "",
  //       photo: "",
  //       userID: "",
  //       email: "",
  //     };
  //   }
  // },
});
