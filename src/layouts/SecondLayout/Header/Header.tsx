import { useAppDispatch } from "@/hooks";
import { toggleSidebar } from "@/redux/slices/secondLayoutSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import MiscellaneousOptions from "../MiscellaneousOptions";

function Header() {
  const dispatch = useAppDispatch();

  return (
    <AppBar elevation={3}>
      <Toolbar>
        <IconButton edge="start" aria-label="menu" onClick={() => dispatch(toggleSidebar())}>
          <MenuIcon />
        </IconButton>
        <Box flex={1} />
        <MiscellaneousOptions />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
