import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import SimplePeer from "simple-peer";

interface InitialState {
  stream: MediaStream | null;
  peer: SimplePeer.Instance | null;
  guestStream: MediaStream | null;
}

const initialState: InitialState = {
  stream: null,
  peer: null,
  guestStream: null,
};

export const streamSlice = createSlice({
  name: "streamStore",
  initialState,
  reducers: {
    updateStream(state, action: PayloadAction<{ stream: MediaStream | null }>) {
      state.stream = action.payload.stream;
    },
    updatePeer(state, action: PayloadAction<{ peer: SimplePeer.Instance }>) {
      state.peer = action.payload.peer;
    },
    updateGuestStream(
      state,
      action: PayloadAction<{ stream: MediaStream | null }>
    ) {
      state.guestStream = action.payload.stream;
    },
  },
});

export default streamSlice.reducer;

export const { updateStream, updatePeer, updateGuestStream } =
  streamSlice.actions;
