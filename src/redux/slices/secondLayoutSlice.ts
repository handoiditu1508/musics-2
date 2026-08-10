import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type SecondLayoutState = {
  sidebarOpen: boolean;
  sidebarWidth: number;
  bottomHeight: number;
  tabValue: number;
};

const initialState: SecondLayoutState = {
  sidebarOpen: true,
  sidebarWidth: 300,
  bottomHeight: 100,
  tabValue: 0,
};

const secondLayoutSlice = createSlice({
  name: "secondLayout",
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.sidebarOpen = action.payload;
      } else {
        state.sidebarOpen = !state.sidebarOpen;
      }
    },
    updateTabValue: (state, action: PayloadAction<number>) => {
      state.tabValue = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  updateTabValue,
} = secondLayoutSlice.actions;

export const secondLayoutSelectors = {
  sidebarOpen: (state: RootState) => state.secondLayout.sidebarOpen,
  sidebarWidth: (state: RootState) => state.secondLayout.sidebarWidth,
  bottomHeight: (state: RootState) => state.secondLayout.bottomHeight,
  tabValue: (state: RootState) => state.secondLayout.tabValue,
};

export default secondLayoutSlice;
