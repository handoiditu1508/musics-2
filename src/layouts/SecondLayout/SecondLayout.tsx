import Suspense from "@/components/Suspense";
import { BreakpointsContext, xsMediaQuery } from "@/contexts/breakpoints";
import { useAppSelector } from "@/hooks";
import { selectBottomHeight } from "@/redux/slices/secondLayoutSlice";
import { Box, Paper, useTheme } from "@mui/material";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Bottombar from "./Bottombar";
import Header from "./Header";
import Sidebar from "./Sidebar";

function SecondLayout() {
  const theme = useTheme();
  const bottomHeight = useAppSelector(selectBottomHeight);
  const { mdAndDown } = useContext(BreakpointsContext);

  return (
    <Box sx={{
      display: "flex",
    }}>
      {mdAndDown && <Header />}
      <Sidebar />
      <Paper
        elevation={1}
        square
        sx={{
          flex: 1,
          height: "100vh",
          paddingBottom: `${bottomHeight}px`,
          paddingTop: "var(--mui-constants-headerHeight)",
          boxSizing: "border-box",
          [xsMediaQuery(theme.breakpoints)]: {
            paddingTop: "var(--mui-constants-xsHeaderHeight)",
          },
        }}>{/* background color for body */}
        <Box sx={{
          height: "100%",
          overflowY: "auto",
          ...theme.mixins.scrollbar,
        }}>{/* container to hide away padding bottom */}
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
