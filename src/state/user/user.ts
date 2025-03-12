import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { useAuth } from "../../auth/AuthContext";

interface UserStateTypes {
  username: string;
  photo: string;
  userID: string;
  email: string;

  // playlists:
}

interface GenericPayload {
  [key: string]: any;
}

const initialState: UserStateTypes = {
  username: "",
  photo: "",
  userID: "",
  email: "",
};

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
      );
  },
});

// ! createAsyncThunk(1st arg TYPE, 2nd callback fn)
export const getUserAsync = createAsyncThunk("user/getUserAsync", async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const getAccessToken = () =>
      JSON.parse(localStorage.getItem("access_token") || "");

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
