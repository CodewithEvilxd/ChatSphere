import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    onlineUsers: {},
  },
  reducers: {
    setOnlineStatus: (state, action) => {
      state.onlineUsers[action.payload] = true;
    },
    setOfflineStatus: (state, action) => {
      state.onlineUsers[action.payload] = false;
    },
  },
});

export const { setOnlineStatus, setOfflineStatus } = userSlice.actions;
export default userSlice.reducer;

export const selectedOnlineUser = (state) => state.users.onlineUsers;
