import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Users } from "../../../consts";

interface InitialState {
  userId: string;
  userName: string;
  users: Users;
}
const initialState: InitialState = { userId: "", userName: "", users: {} };

export const userSlice = createSlice({
  name: "UserStore",
  initialState,
  reducers: {
    updateUserId(state, action: PayloadAction<{ id: string }>) {
      state.userId = action.payload.id;
    },
    updateUserName(state, action: PayloadAction<{ userName: string }>) {
      state.userName = action.payload.userName;
    },
    updateClientsList(state, action: PayloadAction<{ users: Users }>) {
      state.users = action.payload.users;
    },
  },
});

export default userSlice.reducer;

export const { updateUserId, updateUserName, updateClientsList } =
  userSlice.actions;
