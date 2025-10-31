import CONFIG from "@/configs";
import { BreakpointsContext, lgAndUpMediaQuery } from "@/contexts/breakpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectBottomHeight, selectSidebarOpen, selectSidebarWidth, toggleSidebar } from "@/redux/slices/secondLayoutSlice";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Drawer from "@mui/material/Drawer";
import { CSSObject, Theme, useTheme } from "@mui/material/styles";
import { useContext } from "react";
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
  const { xsAndDown, lgAndUp } = useContext(BreakpointsContext);
  const togglingCss = lgAndUp ? (open ? openedMixin(theme, sidebarWidth) : closedMixin(theme)) : CONFIG.EMPTY_OBJECT;

  return (
    <Box
      component="nav"
      sx={[
        togglingCss,
        {
          position: "relative",
          ":hover": {
            ".toggle-sidebar-btn": {
              opacity: 1,
            },
          },
          [lgAndUpMediaQuery(theme.breakpoints)]: {
            paddingBottom: `${bottomHeight}px`,
          },
        },
      ]}>
      {lgAndUp && <ButtonBase
        className="toggle-sidebar-btn"
        sx={{
          position: "absolute",
          right: -14,
          top: 150,
          zIndex: theme.zIndex.drawer + 1,
          width: 14,
          height: 60,
          ["@media (hover: hover)"]: {
            ...(open && {
              opacity: 0,
            }),
          },
        }}
        onClick={() => dispatch(toggleSidebar())}>
        <Box sx={{
          borderLeft: `14px solid ${theme.vars.palette.scrollbar.hover.track}`,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          height: 60,
          width: 0,
          transition: theme.transitions.create(["border-left-color", "opacity"], {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.easeInOut,
          }),
          ":hover": {
            opacity: 0.7,
          },
        }}
        />
      </ButtonBase>}
      <Drawer
        open={open}
        variant={lgAndUp ? "permanent" : "temporary"}
        anchor={xsAndDown ? "bottom" : "left"}
        sx={[
          togglingCss,
          xsAndDown && {
            width: "100%",
          },
        ]}
        slotProps={{
          paper: {
            sx: [
              togglingCss,
              xsAndDown && {
                width: "100%",
                height: "calc(100% - var(--mui-constants-xsHeaderHeight))",
              },
            ],
            elevation: 3,
          },
        }}
        hideBackdrop={xsAndDown}
        onClose={() => dispatch(toggleSidebar(false))}>
        <SidebarTabs />
      </Drawer>
    </Box>
  );
}

export default Sidebar;
