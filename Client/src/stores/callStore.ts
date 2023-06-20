import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Caller } from "../../../consts";

interface InitialState {
  caller: Caller | null;
  receivingCall: boolean;
  callAccepted: boolean | null;
}

const initialState: InitialState = {
  receivingCall: false,
  caller: null,
  callAccepted: null,
};

export const callSlice = createSlice({
  name: "callStore",
  initialState,
  reducers: {
    updateCaller(state, action: PayloadAction<{ caller: Caller }>) {
      state.caller = action.payload.caller;
    },
    updateReceivingCall(
      state,
      action: PayloadAction<{ receivingCall: boolean }>
    ) {
      state.receivingCall = action.payload.receivingCall;
    },
    updateCallAccepted(
      state,
      action: PayloadAction<{ callAccepted: boolean }>
    ) {
      state.callAccepted = action.payload.callAccepted;
    },
  },
});

export default callSlice.reducer;

export const { updateReceivingCall, updateCaller, updateCallAccepted } =
  callSlice.actions;
