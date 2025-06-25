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
  /**
   * min 0, max 1.
   */
  volume: number;
  muted: boolean;
  /**
   * Miliseconds.
   */
  cooldownTime: number;
  currentTimeoutId?: string | number;
  /**
   * Miliseconds.
   */
  currentTimeoutDuration: number;
};

const initialState: AudioFilesState = {
  ...audioFilesAdapter.getInitialState(),
  ids: CONFIG.EMPTY_ARRAY,
  query: "",
  queriedAudioFiles: CONFIG.EMPTY_ARRAY,
  orderedIds: CONFIG.EMPTY_ARRAY,
  artists: CONFIG.EMPTY_ARRAY,
  isAutoPlay: true,
  volume: 1,
  muted: false,
  cooldownTime: 0,
  currentTimeoutDuration: 0,
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
      state.selectedId = getNextAudioFileId(state);
    },
    previousAudio: (state) => {
      state.selectedId = getPreviousAudioFileId(state);
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
    setAsNextAudio: (state, action: PayloadAction<number>) => {
      const currentIndex = state.orderedIds.indexOf(action.payload);

      // selected id not exist
      if (currentIndex === -1) {
        return;
      }

      if (state.selectedId === undefined) {
        // just play the audio if no audio is selected
        const currentId = state.orderedIds[currentIndex];
        state.orderedIds.unshift(currentId);
        state.selectedId = currentId;
      } else {
        // remove the current id from the list
        // and add it to the next position of the selected id
        const [currentId] = state.orderedIds.splice(currentIndex, 1);
        const selectedIndex = state.orderedIds.indexOf(state.selectedId);

        // selected id not exist
        if (selectedIndex === -1) {
          return;
        }

        // selected id is last in the list
        if (selectedIndex === state.orderedIds.length - 1) {
          state.orderedIds.push(currentId);
        } else {
          state.orderedIds.splice(selectedIndex + 1, 0, currentId);
        }

        state.queriedAudioFiles = state.orderedIds.map((id) => state.entities[id]);
        queryAudioFiles(state);
      }
    },
    moveUp: (state, action: PayloadAction<number>) => {
      const currentIndex = state.orderedIds.indexOf(action.payload);

      // selected id not exist
      if (currentIndex === -1) {
        return;
      }

      // selected id is first in the list
      if (currentIndex === 0) {
        return;
      }

      const [currentId] = state.orderedIds.splice(currentIndex, 1);
      state.orderedIds.splice(currentIndex - 1, 0, currentId);

      state.queriedAudioFiles = state.orderedIds.map((id) => state.entities[id]);
      queryAudioFiles(state);
    },
    moveDown: (state, action: PayloadAction<number>) => {
      const currentIndex = state.orderedIds.indexOf(action.payload);

      // selected id not exist
      if (currentIndex === -1) {
        return;
      }

      // selected id is last in the list
      if (currentIndex === state.orderedIds.length - 1) {
        return;
      }

      const [currentId] = state.orderedIds.splice(currentIndex, 1);
      state.orderedIds.splice(currentIndex + 1, 0, currentId);

      state.queriedAudioFiles = state.orderedIds.map((id) => state.entities[id]);
      queryAudioFiles(state);
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.muted = action.payload;
    },
    setCooldownTime: (state, action: PayloadAction<number>) => {
      state.cooldownTime = action.payload;
    },
    setCurrentTimeout: (state, action: PayloadAction<{
      timeoutId?: string | number;
      duration: number;
    }>) => {
      state.currentTimeoutId = action.payload.timeoutId;
      state.currentTimeoutDuration = action.payload.duration;
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

const getNextAudioFileId = (state: AudioFilesState): number | undefined => {
  // empty list
  if (state.orderedIds.length === 0) {
    return undefined;
  }

  // no id selected
  if (state.selectedId === undefined) {
    return state.orderedIds[0];
  }

  const currentIndex = state.orderedIds.indexOf(state.selectedId);

  // selected id not exist
  if (currentIndex === -1) {
    return undefined;
  }

  // selected id is last in the list
  if (currentIndex === state.orderedIds.length - 1) {
    return state.orderedIds[0];
  }

  return state.orderedIds[currentIndex + 1];
};

const getPreviousAudioFileId = (state: AudioFilesState): number | undefined => {
  // empty list
  if (state.orderedIds.length === 0) {
    return undefined;
  }

  // no id selected
  if (state.selectedId === undefined) {
    return state.orderedIds.at(-1);
  }

  const currentIndex = state.orderedIds.indexOf(state.selectedId);

  // selected id not exist
  if (currentIndex === -1) {
    return undefined;
  }

  // selected id is first in the list
  if (currentIndex === 0) {
    return state.orderedIds.at(-1);
  }

  return state.orderedIds[currentIndex - 1];
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
  setAsNextAudio,
  moveUp,
  moveDown,
  setVolume,
  setMuted,
  setCooldownTime,
  setCurrentTimeout,
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
export const selectVolume = (state: RootState) => state.audioFiles.volume;
export const selectMuted = (state: RootState) => state.audioFiles.muted;
export const selectCooldownTime = (state: RootState) => state.audioFiles.cooldownTime;
export const selectCurrentTimeoutId = (state: RootState) => state.audioFiles.currentTimeoutId;
export const selectCurrentTimeoutDuration = (state: RootState) => state.audioFiles.currentTimeoutDuration;
export const selectNextAudioFile = (state: RootState) => {
  const nextId = getNextAudioFileId(state.audioFiles);

  return nextId ? audioFilesSelectors.selectById(state, nextId) : undefined;
};
export const selectPreviousAudioFile = (state: RootState) => {
  const previousId = getPreviousAudioFileId(state.audioFiles);

  return previousId ? audioFilesSelectors.selectById(state, previousId) : undefined;
};
