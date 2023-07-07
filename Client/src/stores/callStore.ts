import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Caller } from "../../../consts";

interface InitialState {
  caller: Caller | null;
  receivingCall: boolean;
  callAccepted: boolean | null;
  onCallWith: string;
  callDeclined: boolean;
  callingUser: { status: boolean; id: string };
}

const initialState: InitialState = {
  receivingCall: false,
  callDeclined: false,
  callingUser: { status: false, id: "" },
  caller: null,
  callAccepted: null,
  onCallWith: "",
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
      state.callingUser = { status: false, id: "" };
    },
    updateOnCallWith(state, action: PayloadAction<{ userId: string }>) {
      state.onCallWith = action.payload.userId;
    },
    updateCallDeclined(state, action: PayloadAction<{ status: boolean }>) {
      state.callDeclined = action.payload.status;
      state.callingUser = { status: false, id: "" };
    },
    updateCallingUser(
      state,
      action: PayloadAction<{ status: boolean; id: string }>
    ) {
      state.callingUser = {
        status: action.payload.status,
        id: action.payload.id,
      };
    },
    resetState(state) {
      state.callAccepted = null;
      state.caller = null;
      state.onCallWith = "";
      state.callingUser = { status: false, id: "" };
      state.receivingCall = false;
    },
  },
});

export default callSlice.reducer;

export const {
  updateReceivingCall,
  updateCaller,
  updateCallAccepted,
  resetState,
  updateOnCallWith,
  updateCallDeclined,
  updateCallingUser,
} = callSlice.actions;
