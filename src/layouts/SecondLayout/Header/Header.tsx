import { BreakpointsContext } from "@/contexts/breakpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectSidebarOpen, toggleSidebar } from "@/redux/slices/secondLayoutSlice";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { useContext } from "react";
import MiscellaneousOptions from "../MiscellaneousOptions";
import NextSongTimeoutProgress from "../NextSongTimeoutProgress";

function Header() {
  const theme = useTheme();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const { xsAndDown } = useContext(BreakpointsContext);
  const dispatch = useAppDispatch();

  return (
    <AppBar
      elevation={3}
      color="inherit"
      sx={[
        xsAndDown && sidebarOpen && {
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: "none",
        },
      ]}>
      <Toolbar>
        <IconButton edge="start" aria-label="menu" onClick={() => dispatch(toggleSidebar())}>
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Box flex={1} />
        {xsAndDown && <NextSongTimeoutProgress />}
        <MiscellaneousOptions />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
