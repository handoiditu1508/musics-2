import { formatBytes, formatSeconds } from "@/common/formats";
import { useAppSelector } from "@/hooks";
import { selectSelectedAudioFile } from "@/redux/slices/audioFileSlice";
import { styled, Typography } from "@mui/material";

const StyledTable = styled("table")(({ theme }) => ({
  maxWidth: 400,
  margin: `${theme.spacing(1)} auto 0`,
  borderCollapse: "separate",
  borderSpacing: theme.spacing(1),
}));

function HomePage() {
  const selectedAudioFile = useAppSelector(selectSelectedAudioFile);

  return (
    selectedAudioFile && (
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
    )
  );
}

export default HomePage;
