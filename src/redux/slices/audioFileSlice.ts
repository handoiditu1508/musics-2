import AudioFile from "@/models/entities/AudioFile";
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const audioFilesAdapter = createEntityAdapter<AudioFile>();

export type AudioFilesState = EntityState<AudioFile, number> & {
  selectedId?: number;
  query: string;
  queriedAudioFiles: AudioFile[];
};

const initialState: AudioFilesState = {
  ...audioFilesAdapter.getInitialState(),
  query: "",
  queriedAudioFiles: [],
};

export const audioFilesSlice = createSlice({
  name: "audioFiles",
  initialState: initialState,
  reducers: {
    setAudioFiles: (state, action: PayloadAction<AudioFile[]>) => {
      audioFilesAdapter.setAll(state, action.payload);
    },
    setSelectedAudioFileId: (state, action: PayloadAction<number>) => {
      if (state.entities[action.payload]) {
        state.selectedId = action.payload;
      }
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.queriedAudioFiles = state.ids
        .map((id) => state.entities[id])
        .filter((audioFile) => audioFile.name.toLowerCase().includes(state.query));
    },
  },
});

export const {
  setAudioFiles,
  setSelectedAudioFileId,
  setQuery,
} = audioFilesSlice.actions;

const audioFilesSelectors = audioFilesAdapter.getSelectors<RootState>((state) => state.audioFiles);

export const {
  selectAll: selectAudioFiles,
} = audioFilesSelectors;

export const selectSelectedAudioFileId = (state: RootState) => state.audioFiles.selectedId;
export const selectSelectedAudioFile = (state: RootState) => (state.audioFiles.selectedId ? audioFilesSelectors.selectById(state, state.audioFiles.selectedId) : undefined);
export const selectQuery = (state: RootState) => state.audioFiles.query;
export const selectQueriedAudioFiles = (state: RootState) => state.audioFiles.queriedAudioFiles;
