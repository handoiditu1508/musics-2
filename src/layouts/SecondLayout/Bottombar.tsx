import { useAppSelector } from "@/hooks";
import { selectBottomHeight } from "@/redux/slices/secondLayoutSlice";
import { Paper, useTheme } from "@mui/material";

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
        zIndex: theme.zIndex.drawer + 1,
      }}
    />
  );
}

export default Bottombar;
