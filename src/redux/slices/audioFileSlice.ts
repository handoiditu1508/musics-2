import AudioFile from "@/models/entities/AudioFile";
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const audioFilesAdapter = createEntityAdapter<AudioFile>();

export const audioFilesSlice = createSlice({
  name: "audioFiles",
  initialState: audioFilesAdapter.getInitialState(),
  reducers: {
    setAudioFiles: (state, action: PayloadAction<AudioFile[]>) => {
      audioFilesAdapter.setAll(state, action.payload);
    },
  },
});

export const {
  setAudioFiles,
} = audioFilesSlice.actions;

const audioFilesSelectors = audioFilesAdapter.getSelectors<RootState>((state) => state.audioFiles);

export const {
  selectAll: selectAudioFiles,
} = audioFilesSelectors;
