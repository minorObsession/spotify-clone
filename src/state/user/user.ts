import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAccessToken } from "../../auth/authHelpers";
import { RootState } from "../store";
export interface Playlist {
  name: string;
  id: string;
  images: any[];
}

interface UserStateTypes {
  username: string;
  photo: string;
  userID: string;
  email: string;
  playlists: Playlist[];
}

interface GenericPayload {
  [key: string]: any;
}

const initialState: UserStateTypes = {
  username: "",
  photo: "",
  userID: "",
  email: "",
  playlists: [],
};

// ! make new SLICE FOR PLAYLISTS
// ! make new SLICE FOR PODCASTS
// ! make new SLICE FOR PODCASTS
//

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ! action functions..
  },
  // ! when async, has to be extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(getUserAsync.pending, () => {
        console.log("pending...");
      })
      .addCase(
        getUserAsync.fulfilled,
        // ! payload action is an object (pretend you don't know the type)
        (state, action: PayloadAction<GenericPayload>) => {
          if (typeof action.payload === "object" && action.payload !== null) {
            state.photo = action.payload?.images[0].url;
            state.userID = action.payload?.id;
            state.username = action.payload?.display_name;
            state.email = action.payload?.email;
          }
        },
      )
      .addCase(getPlaylists.pending, () => {
        console.log("pending playlists...");
      })
      .addCase(
        getPlaylists.fulfilled,
        (state, action: PayloadAction<GenericPayload>) => {
          // ! reused twice
          if (typeof action.payload === "object" && action.payload !== null) {
            console.log(action.payload);
            state.playlists = action.payload.items;
          }
        },
      );
  },
});

export const getPlaylists = createAsyncThunk(
  "user/getPlaylists",
  async (_, thunkAPI) => {
    try {
      const accessToken = getAccessToken();
      const state = thunkAPI.getState() as RootState;
      const id = state.user.userID;

      if (!accessToken)
        return new Error("🛑 🛑 access token expired or it doesn't exist");

      const res = await fetch(
        `https://api.spotify.com/v1/users/${id}/playlists`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("no user or bad request");

      const playlists = await res.json();
      return playlists;
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
);

// ! createAsyncThunk(1st arg TYPE, 2nd callback fn)
export const getUserAsync = createAsyncThunk("user/getUserAsync", async () => {
  console.log(Date.now());
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const accessToken = getAccessToken();

    if (!accessToken)
      return new Error("access token expired or it doesn't exist");
    const res = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("no user or bad request");

    const user = await res.json();

    return user;
  } catch (err) {
    console.error("🛑 ❌", err);
  }
});

// export const {} = UserSlice.actions;

export default UserSlice.reducer;
