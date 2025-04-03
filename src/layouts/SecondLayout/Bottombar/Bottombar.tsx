import { useAppSelector } from "@/hooks";
import { selectSelectedAudioFile } from "@/redux/slices/audioFileSlice";
import { selectBottomHeight } from "@/redux/slices/secondLayoutSlice";
import { Box, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import AudioPlayer from "./AudioPlayer";
import MiscellaneousOptions from "./MiscellaneousOptions";

function Bottombar() {
  const theme = useTheme();
  const bottomHeight = useAppSelector(selectBottomHeight);
  const selectedAudioFile = useAppSelector(selectSelectedAudioFile);
  const artistsText = selectedAudioFile ? selectedAudioFile.artists.join(", ") : "";

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        height: bottomHeight,
        width: "100%",
        boxSizing: "border-box",
        zIndex: theme.zIndex.drawer + 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 1,
      }}
    >
      <Box sx={{
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 300,
        width: 300,
      }}>
        {selectedAudioFile && <>
          <Typography variant="body1">{selectedAudioFile.title}</Typography>
          <Tooltip title={artistsText} placement="top">
            <Typography variant="body2" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{artistsText}</Typography>
          </Tooltip>
        </>}
      </Box>
      <AudioPlayer />
      <MiscellaneousOptions />
    </Paper>
  );
}

export default Bottombar;
