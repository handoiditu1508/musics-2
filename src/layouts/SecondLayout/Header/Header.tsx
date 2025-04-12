import { BreakpointsContext } from "@/contexts/breakpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectSidebarOpen, toggleSidebar } from "@/redux/slices/secondLayoutSlice";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { AppBar, Box, IconButton, Toolbar, useTheme } from "@mui/material";
import { useContext } from "react";
import MiscellaneousOptions from "../MiscellaneousOptions";

function Header() {
  const theme = useTheme();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const { xs } = useContext(BreakpointsContext);
  const dispatch = useAppDispatch();

  return (
    <AppBar
      elevation={3}
      sx={[
        xs && sidebarOpen && {
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: "none",
        },
      ]}>
      <Toolbar>
        <IconButton edge="start" aria-label="menu" onClick={() => dispatch(toggleSidebar())}>
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Box flex={1} />
        <MiscellaneousOptions />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
