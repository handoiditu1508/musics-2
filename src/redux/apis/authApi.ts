import { LoginResponse } from "@/models/apis/login";
import appApi from "./appApi";

const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/refreshToken",
        method: "POST",
      }),
      invalidatesTags: (result) => (result ? ["UNAUTHORIZED"] : []),
    }),
  }),
});

export default authApi;

export const {
  useRefreshTokenMutation,
} = authApi;
