import { createSlice } from "@reduxjs/toolkit";
import { type User } from "../../../types";

interface UserState {
  userData: User | null;
}

const initialState: UserState = {
  userData: null,
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
  },
});

export const { setUser, clearUser, setUserProfilePicUrl } = userSlice.actions;
export default userSlice.reducer;
