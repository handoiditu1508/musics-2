import CONFIG from "@/configs";
import AudioFile from "@/models/entities/AudioFile";
import AudioFileData from "@/models/entities/AudioFileData";
import { updateAudioFiles } from "../slices/audioFileSlice";
import { providesIdTag, providesListTags } from "../utils/rtkQueryCacheUtils";
import appApi from "./appApi";

const audioFileApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAudioFiles: builder.query<AudioFile[], void>({
      query: () => "js/filesList.json",
      transformResponse: (data: AudioFileData[]) => {
        return data.map<AudioFile>((d) => ({
          ...d,
          path: `${CONFIG.API_URL}musics/${d.name}`,
        }));
      },
      onQueryStarted: async (_, api) => {
        try {
          const { data: audioFiles } = await api.queryFulfilled;
          api.dispatch(updateAudioFiles(audioFiles));
        } catch {}
      },
      providesTags: (result, error) => providesListTags("AudioFile", result, error),
    }),
    getLyrics: builder.query<string, string>({
      queryFn: async (lyricsFile, api, extraOptions, baseQuery) => {
        var response = await fetch(`${CONFIG.API_URL}lyrics/${lyricsFile}`);

        if (response.ok) {
          const lyrics = await response.text();

          return {
            data: lyrics.trim(),
          };
        } else {
          return {
            error: {
              error: "Error fetching lyrics",
              originalStatus: response.status,
              status: response.status,
              data: undefined,
            },
          };
        }
      },
      providesTags: (result, error, fileName) => providesIdTag("AudioFile", `LYRICS-${fileName}`, error),
    }),
  }),
});

export default audioFileApi;

export const {
  useGetAudioFilesQuery,
  useGetLyricsQuery,
} = audioFileApi;
