import CONFIG from "@/configs";
import AudioFile from "@/models/entities/AudioFile";
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const audioFilesAdapter = createEntityAdapter<AudioFile>();

export type AudioFilesState = EntityState<AudioFile, number> & {
  selectedId?: number;
  query: string;
  queriedAudioFiles: AudioFile[];
  orderedIds: number[];
  artists: string[];
  isAutoPlay: boolean;
};

const initialState: AudioFilesState = {
  ...audioFilesAdapter.getInitialState(),
  ids: CONFIG.EMPTY_ARRAY,
  query: "",
  queriedAudioFiles: CONFIG.EMPTY_ARRAY,
  orderedIds: CONFIG.EMPTY_ARRAY,
  artists: CONFIG.EMPTY_ARRAY,
  isAutoPlay: true,
};

export const audioFilesSlice = createSlice({
  name: "audioFiles",
  initialState: initialState,
  reducers: {
    updateAudioFiles: (state, action: PayloadAction<AudioFile[]>) => {
      audioFilesAdapter.setAll(state, action.payload);
      state.queriedAudioFiles = action.payload;
      queryAudioFiles(state);

      // set artists
      state.artists = action.payload.flatMap((audioFile) => audioFile.artists);
      // remove duplicate artists
      state.artists = [...new Set(state.artists)];
      // order by alphabet
      state.artists = state.artists.sort();

      // set audioFileOrderedIds
      state.orderedIds = state.ids;
    },
    updateSelectedAudioFileId: (state, action: PayloadAction<number>) => {
      if (state.entities[action.payload]) {
        state.selectedId = action.payload;
      }
    },
    nextAudio: (state) => {
      // empty list
      if (state.orderedIds.length === 0) {
        return;
      }

      // no id selected
      if (state.selectedId === undefined) {
        state.selectedId = state.orderedIds[0];

        return;
      }

      const currentIndex = state.orderedIds.indexOf(state.selectedId);

      // selected id not exist
      if (currentIndex === -1) {
        return;
      }

      // selected id is last in the list
      if (currentIndex === state.orderedIds.length - 1) {
        let isRepeat = true;
        if (isRepeat) {
          state.selectedId = state.orderedIds[0];
        }

        return;
      }

      state.selectedId = state.orderedIds[currentIndex + 1];
    },
    previousAudio: (state) => {
      // empty list
      if (state.orderedIds.length === 0) {
        return;
      }

      // no id selected
      if (state.selectedId === undefined) {
        state.selectedId = state.orderedIds.at(-1);

        return;
      }

      const currentIndex = state.orderedIds.indexOf(state.selectedId);

      // selected id not exist
      if (currentIndex === -1) {
        return;
      }

      // selected id is first in the list
      if (currentIndex === 0) {
        let isRepeat = true;
        if (isRepeat) {
          state.selectedId = state.orderedIds.at(-1);
        }

        return;
      }

      state.selectedId = state.orderedIds[currentIndex - 1];
    },
    updateQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.queriedAudioFiles = state.orderedIds.map((id) => state.entities[id]);
      queryAudioFiles(state);
    },
    updateArtistQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload.includes(" ") ? `artist:"${action.payload}"` : `artist:${action.payload}`;
      state.queriedAudioFiles = state.orderedIds.map((id) => state.entities[id]);
      queryAudioFiles(state);
    },
    shuffleAudioFiles: (state) => {
      // using the Fisher-Yates shuffle
      for (let i = state.orderedIds.length - 1; i > 0; i--) {
        // Generate random index
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        const temp = state.orderedIds[i];
        state.orderedIds[i] = state.orderedIds[j];
        state.orderedIds[j] = temp;
      }

      state.queriedAudioFiles = state.orderedIds.map((id) => state.entities[id]);
      queryAudioFiles(state);
    },
    unShuffleAudioFiles: (state) => {
      state.orderedIds = state.ids;
      state.queriedAudioFiles = state.orderedIds.map((id) => state.entities[id]);
      queryAudioFiles(state);
    },
    setIsAutoPlay: (state, action: PayloadAction<boolean>) => {
      state.isAutoPlay = action.payload;
    },
  },
});

/**
 * `artist:tom` => `tom`, `artist:"tom jerry"` => `tom jerry`, `artist:tom jerry` => `tom`
 */
const extractQueriedArtist = (query: string): string | null => {
  const match = query.match(/artist:"([^"]+)"|artist:([^"\s]+)/);
  if (match) {
    return match[1] || match[2];
  }

  return null;
};

const queryAudioFiles = (state: AudioFilesState) => {
  if (state.query) {
    let queriedArtist = extractQueriedArtist(state.query);

    if (queriedArtist) {
      queriedArtist = queriedArtist.toLowerCase();
      state.queriedAudioFiles = state.queriedAudioFiles.filter((audioFile) => audioFile.artists.some((artist) => artist.toLowerCase() === queriedArtist));
    } else {
      const query = state.query.toLowerCase();
      state.queriedAudioFiles = state.queriedAudioFiles.filter((audioFile) => audioFile.name.toLowerCase().includes(query));
    }
  }
};

export const {
  updateAudioFiles,
  updateSelectedAudioFileId,
  nextAudio,
  previousAudio,
  updateQuery,
  updateArtistQuery,
  shuffleAudioFiles,
  unShuffleAudioFiles,
  setIsAutoPlay,
} = audioFilesSlice.actions;

const audioFilesSelectors = audioFilesAdapter.getSelectors<RootState>((state) => state.audioFiles);

export const {
  selectAll: selectAudioFiles,
} = audioFilesSelectors;

export const selectSelectedAudioFileId = (state: RootState) => state.audioFiles.selectedId;
export const selectSelectedAudioFile = (state: RootState) => (state.audioFiles.selectedId ? audioFilesSelectors.selectById(state, state.audioFiles.selectedId) : undefined);
export const selectQuery = (state: RootState) => state.audioFiles.query;
export const selectQueriedAudioFiles = (state: RootState) => state.audioFiles.queriedAudioFiles;
export const selectArtists = (state: RootState) => state.audioFiles.artists;
export const selectIsAudioFilesShuffled = (state: RootState) => state.audioFiles.ids !== state.audioFiles.orderedIds;
export const selectIsAutoPlay = (state: RootState) => state.audioFiles.isAutoPlay;
