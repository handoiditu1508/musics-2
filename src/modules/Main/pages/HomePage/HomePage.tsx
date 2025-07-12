import { formatBytes, formatSeconds } from "@/common/formats";
import { useAppSelector } from "@/hooks";
import { useGetLyricsQuery } from "@/redux/apis/audioFileApi";
import { selectSelectedAudioFile } from "@/redux/slices/audioFileSlice";
import { Box, Skeleton, styled, Typography } from "@mui/material";

const StyledTable = styled("table")(({ theme }) => ({
  maxWidth: 400,
  margin: `${theme.spacing(1)} auto 0`,
  borderCollapse: "separate",
  borderSpacing: theme.spacing(1),
}));

function HomePage() {
  const selectedAudioFile = useAppSelector(selectSelectedAudioFile);
  const lyricsFile = selectedAudioFile && selectedAudioFile.lyricsFile ? selectedAudioFile.lyricsFile : "";
  const { data, isFetching, isSuccess } = useGetLyricsQuery(lyricsFile, {
    skip: !lyricsFile,
  });

  return (
    selectedAudioFile && (
      <Box sx={{
        paddingX: 2,
        paddingBottom: 2,
      }}>
        <StyledTable>
          <tbody>
            <tr>
              <td><Typography>{selectedAudioFile.name}</Typography></td>
              <td><Typography variant="body2">{formatBytes(selectedAudioFile.size)}</Typography></td>
            </tr>
            <tr>
              <td><Typography>{selectedAudioFile.title}</Typography></td>
              <td><Typography variant="body2">{formatSeconds(selectedAudioFile.duration)}</Typography></td>
            </tr>
            <tr>
              <td><Typography>{selectedAudioFile.artists.join(", ")}</Typography></td>
            </tr>
          </tbody>
        </StyledTable>
        {selectedAudioFile.lyricsFile && <Box sx={{
          whiteSpace: "pre-line",
          marginTop: 2,
          marginX: "auto",
          maxWidth: 600,
        }}>
          {isFetching && <>
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" width="50%" />
            <br />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" width="50%" />
            <br />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" width="50%" />
            <br />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" width="50%" />
            <br />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" width="50%" />
          </>}
          {isSuccess && data}
        </Box>}
      </Box>
    )
  );
}

export default HomePage;
