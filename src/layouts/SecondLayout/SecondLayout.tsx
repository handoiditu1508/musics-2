import Suspense from "@/components/Suspense";
import { useAppSelector } from "@/hooks";
import { selectBottomHeight } from "@/redux/slices/secondLayoutSlice";
import { Box, Paper, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Bottombar from "./Bottombar";
import Sidebar from "./Sidebar";

function SecondLayout() {
  const theme = useTheme();
  const bottomHeight = useAppSelector(selectBottomHeight);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Paper
        elevation={1}
        square
        sx={{
          flex: 1,
          minHeight: "100vh",
          paddingBottom: `${bottomHeight}px`,
          boxSizing: "border-box",
        }}>{/* background color for body */}
        <Box>{/* container to hide away padding bottom */}
          <Suspense>
            <Outlet />
          </Suspense>
        </Box>
      </Paper>
      <Bottombar />
    </Box>
  );
}

export default SecondLayout;
