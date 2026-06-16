import { blueprintGraphApi } from '@/api/blueprint-graph/blueprint-graph-api';
import { formReducer } from '@/features/form/form-slice';
import { modalReducer } from '@/features/modal/modal-slice';
import { prefillReducer } from '@/features/prefill/prefill-slice';
import { configureStore } from '@reduxjs/toolkit';

/**
 * Build a fresh store. The app uses a single instance (`store` below); tests
 * call this to get an isolated store per test so state never leaks between them.
 */
export function makeStore() {
  return configureStore({
    reducer: {
      [blueprintGraphApi.reducerPath]: blueprintGraphApi.reducer,
      modal: modalReducer,
      form: formReducer,
      prefill: prefillReducer,
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
}

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
