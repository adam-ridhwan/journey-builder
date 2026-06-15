import { blueprintGraphApi } from '@/api/blueprint-graph/blueprint-graph-api';
import { modalReducer } from '@/features/modal/modal-slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [blueprintGraphApi.reducerPath]: blueprintGraphApi.reducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // The modal slice intentionally stores React elements (`children`),
        // which are not serializable. Ignore those actions/state paths.
        ignoredActions: ['modalSlice/openModal', 'modalSlice/openSubModal'],
        ignoredPaths: ['modal.children', 'modal.subModal.children'],
      },
    }).concat(blueprintGraphApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
