import { createSlice } from "@reduxjs/toolkit";
import { type User } from "../../../types";

interface UserState {
  userData: User | null;
  userCoords: [number, number] | null;
}

const initialState: UserState = {
  userData: null,
  userCoords: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.userData = null;
    },
    setUserProfilePicUrl: (state, action) => {
      if (state.userData) {
        state.userData.profilePicUrl = action.payload;
      }
    },
    setUserCoords: (state, action) => {
      state.userCoords = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserProfilePicUrl, setUserCoords } =
  userSlice.actions;
export default userSlice.reducer;
