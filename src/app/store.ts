import { blueprintGraphApi } from '@/api/blueprint-graph/blueprint-graph-api';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [blueprintGraphApi.reducerPath]: blueprintGraphApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blueprintGraphApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
