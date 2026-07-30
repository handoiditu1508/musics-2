import { LoginResponse } from "@/models/apis/login";
import User from "@/models/entities/User";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";
import { RootState } from "../store";

export type AuthState = {
  expiration: number | null;// miliseconds
  user: User | null;
};

export const expirationStorageKey = "expiration";
export const refreshTokenExpirationStorageKey = "refreshTokenExpiration";

const initialState: AuthState = {
  expiration: null,
  user: null,
};

export const loadAuthStateFromLocalAsync = createAsyncThunk(
  "auth/loadAuthStateFromLocalAsync",
  async (_arg, thunkApi) => {
    const { auth: state } = thunkApi.getState() as RootState;

    const expiration = Number(localStorage.getItem(expirationStorageKey));
    const isAccessTokenValid = !!expiration && expiration <= Date.now();
    const refreshTokenExpiration = Number(localStorage.getItem(refreshTokenExpirationStorageKey));
    const isRefreshTokenValid = !!refreshTokenExpiration && refreshTokenExpiration <= Date.now();

    if (isRefreshTokenValid) {
      // todo: store refresh token in redux store or something
    }

    if (isAccessTokenValid) {
      thunkApi.dispatch(setAuthExpiration(expiration));
      if (!state.user) {
        // todo: load signed in user details from BE
      }
    } else if (isRefreshTokenValid) {
      // call refresh token api
      const refreshTokenPromise = thunkApi.dispatch(authApi.endpoints.refreshToken.initiate());
      await refreshTokenPromise;
      refreshTokenPromise.reset();
    } else {
      thunkApi.dispatch(clearAuthState());
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<LoginResponse>) => {
      if (action.payload.expiration) {
        state.expiration = action.payload.expiration;
        localStorage.setItem(expirationStorageKey, state.expiration.toString());
      }
    },
    setAuthExpiration: (state, action: PayloadAction<number>) => {
      state.expiration = action.payload;
      localStorage.setItem(expirationStorageKey, state.expiration.toString());
    },
    clearAuthState: (state) => {
      localStorage.removeItem(expirationStorageKey);
      state.expiration = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.refreshToken.matchFulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          const newAction = authSlice.actions.setAuthState(action.payload);
          authSlice.caseReducers.setAuthState(state, newAction);
        }
      )
      .addMatcher(
        authApi.endpoints.refreshToken.matchRejected,
        (state, action) => {
          if (action.payload?.status === 401) {
            authSlice.caseReducers.clearAuthState(state);
          }
        }
      );
  },
});

export const {
  setAuthState,
  setAuthExpiration,
  clearAuthState,
} = authSlice.actions;

export const authSelectors = {
  signedIn: (state: RootState): boolean => !!state.auth.expiration,
  tokenExpired: (state: RootState): boolean => !!state.auth.expiration && state.auth.expiration <= Date.now(),
  expiration: (state: RootState) => state.auth.expiration,
  user: (state: RootState) => state.auth.user,
};

export default authSlice;
