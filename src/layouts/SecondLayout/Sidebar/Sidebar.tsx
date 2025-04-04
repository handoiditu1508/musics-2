import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectBottomHeight, selectSidebarOpen, selectSidebarWidth, toggleSidebar } from "@/redux/slices/secondLayoutSlice";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, CSSObject, Drawer, IconButton, Theme, useTheme } from "@mui/material";
import SidebarTabs from "./SidebarTabs";

const openedMixin = (theme: Theme, sidebarWidth: number): CSSObject => ({
  width: sidebarWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: 0,
});

function Sidebar() {
  const theme = useTheme();
  const sidebarWidth = useAppSelector(selectSidebarWidth);
  const bottomHeight = useAppSelector(selectBottomHeight);
  const open = useAppSelector(selectSidebarOpen);
  const dispatch = useAppDispatch();
  const togglingCss = open ? openedMixin(theme, sidebarWidth) : closedMixin(theme);

  return (
    <Box
      component="nav"
      sx={{
        ...togglingCss,
        position: "relative",
        paddingBottom: `${bottomHeight}px`,
        ":hover": {
          ".toggle-sidebar-btn": {
            opacity: 1,
          },
        },
      }}>
      <IconButton
        size="small"
        className="toggle-sidebar-btn"
        sx={[
          {
            position: "absolute",
            right: -17,
            top: 150,
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["background-color", "opacity"], {
              duration: theme.transitions.duration.shortest,
              easing: theme.transitions.easing.easeInOut,
            }),
            backgroundColor: `rgba(${theme.palette.background.defaultChannel} / 0.5)`,
            ":hover": {
              backgroundColor: `rgba(${theme.palette.background.defaultChannel} / 0.7)`,
            },
          },
          (open && {
            opacity: 0,
            right: -14,
          }),
        ]}
        onClick={() => dispatch(toggleSidebar())}>
        <ChevronRightIcon
          fontSize="inherit"
          sx={{
            transform: open ? "rotate(180deg)" : undefined,
          }}
        />
      </IconButton>
      <Drawer
        open={open}
        variant="permanent"
        sx={togglingCss}
        PaperProps={{
          sx: togglingCss,
          elevation: 3,
        }}
        onClose={() => dispatch(toggleSidebar(false))}>
        <SidebarTabs />
      </Drawer>
    </Box>
  );
}

export default Sidebar;
