import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { BlueprintGraph } from '@/api/blueprint-graph/blueprint-graph-types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const TENANT_ID = import.meta.env.VITE_TENANT_ID ?? '1';
const BLUEPRINT_ID =
  import.meta.env.VITE_BLUEPRINT_ID ?? 'bp_01jk766tckfwx84xjcxazggzyc';

/** Root RTK Query API. Add new endpoints here or via `api.injectEndpoints`. */
export const blueprintGraphApi = createApi({
  reducerPath: 'blueprintGraphApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['BlueprintGraph'],
  endpoints: (builder) => ({
    getBlueprintGraph: builder.query<BlueprintGraph, void>({
      query: () =>
        `/api/v1/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`,
      providesTags: ['BlueprintGraph'],
    }),
  }),
});

export const { useGetBlueprintGraphQuery } = blueprintGraphApi;
