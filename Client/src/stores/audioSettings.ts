import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  sensitivity: number;
  outputVolume: number;
  inputVolume: number;
}

const initialState: InitialState = {
  sensitivity: 100,
  outputVolume: 100,
  inputVolume: 100,
};

export const audioSettingSlice = createSlice({
  name: "audioSettingsStore",
  initialState,
  reducers: {
    updateSensitivity(state, action: PayloadAction<{ amount: number }>) {
      state.sensitivity = action.payload.amount;
    },
    updateOutputVolume(state, action: PayloadAction<{ amount: number }>) {
      state.outputVolume = action.payload.amount;
    },
    updateInputVolume(state, action: PayloadAction<{ amount: number }>) {
      state.inputVolume = action.payload.amount;
    },
  },
});

export default audioSettingSlice.reducer;

export const { updateSensitivity, updateOutputVolume, updateInputVolume } =
  audioSettingSlice.actions;
