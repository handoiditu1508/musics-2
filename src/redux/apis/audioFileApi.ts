import CONFIG from "@/configs";
import AudioFile from "@/models/entities/AudioFile";
import AudioFileData from "@/models/entities/AudioFileData";
import { setAudioFiles } from "../slices/audioFileSlice";
import { providesListTags } from "../utils/rtkQueryCacheUtils";
import appApi from "./appApi";

const audioFileApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAudioFiles: builder.query<AudioFile[], void>({
      query: () => "js/filesList.json",
      transformResponse: (data: AudioFileData[]) => {
        return data.map((d) => ({
          ...d,
          path: `${CONFIG.API_URL}musics/${d.name}`,
        }));
      },
      onQueryStarted: async (_, api) => {
        try {
          const { data: audioFiles } = await api.queryFulfilled;
          api.dispatch(setAudioFiles(audioFiles));
        } catch {}
      },
      providesTags: (result, error) => providesListTags("AudioFile", result, error),
    }),
  }),
});

export default audioFileApi;

export const {
  useGetAudioFilesQuery,
} = audioFileApi;
