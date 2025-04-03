import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import appApi from "./apis/appApi";
import { audioFilesSlice } from "./slices/audioFileSlice";
import authSlice from "./slices/authSlice";
import counterSlice from "./slices/counterSlice";
import { notificationSlice } from "./slices/notificationSlice";
import secondLayoutSlice from "./slices/secondLayoutSlice";
import rtkQueryErrorLoggerMiddleware from "./utils/rtkQueryErrorLoggerMiddleware";

// development environment only
// const reduxLogger = require("redux-logger");
// const logger = reduxLogger.createLogger();

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [counterSlice.name]: counterSlice.reducer,
    [notificationSlice.name]: notificationSlice.reducer,
    [secondLayoutSlice.name]: secondLayoutSlice.reducer,
    [audioFilesSlice.name]: audioFilesSlice.reducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    appApi.middleware,
    rtkQueryErrorLoggerMiddleware,
    // logger,
  ),
});

setupListeners(store.dispatch);

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
