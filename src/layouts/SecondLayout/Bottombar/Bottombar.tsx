import { useAppSelector } from "@/hooks";
import { selectBottomHeight } from "@/redux/slices/secondLayoutSlice";
import { Box, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import AudioPlayer from "./AudioPlayer";
import MiscellaneousOptions from "./MiscellaneousOptions";

function Bottombar() {
  const theme = useTheme();
  const bottomHeight = useAppSelector(selectBottomHeight);

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
        <Typography variant="body1">Song Name</Typography>
        <Tooltip title="Artist 1, Artist 2, Artist 3, Artist 4, Artist 5, Artist 6, Artist 7" placement="top">
          <Typography variant="body2" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">Artist 1, Artist 2, Artist 3, Artist 4, Artist 5, Artist 6, Artist 7</Typography>
        </Tooltip>
      </Box>
      <AudioPlayer />
      <MiscellaneousOptions />
    </Paper>
  );
}

export default Bottombar;
