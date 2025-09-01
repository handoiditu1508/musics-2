import { BreakpointsContext } from "@/contexts/breakpoints";
import { useAppSelector } from "@/hooks";
import { selectSelectedAudioFile } from "@/redux/slices/audioFileSlice";
import { selectBottomHeight } from "@/redux/slices/secondLayoutSlice";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import MiscellaneousOptions from "../MiscellaneousOptions";
import AudioPlayer from "./AudioPlayer";

function Bottombar() {
  const theme = useTheme();
  const bottomHeight = useAppSelector(selectBottomHeight);
  const selectedAudioFile = useAppSelector(selectSelectedAudioFile);
  const artistsText = selectedAudioFile ? selectedAudioFile.artists.join(", ") : "";
  const { lgAndUp } = useContext(BreakpointsContext);

  return (
    <Paper
      elevation={3}
      square
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
      {lgAndUp && <Box sx={{
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
      </Box>}
      <AudioPlayer />
      {lgAndUp && <MiscellaneousOptions />}
    </Paper>
  );
}

export default Bottombar;
