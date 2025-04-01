import CONFIG from "@/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { allTags } from "../utils/rtkQueryCacheUtils";

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl: CONFIG.API_URL }),
  tagTypes: allTags,
  endpoints: (builder) => ({
    refetchErrorQueries: builder.mutation<null, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: ["UNKNOWN_ERROR"],
    }),
  }),
});

export default appApi;

export const {
  useRefetchErrorQueriesMutation,
} = appApi;
