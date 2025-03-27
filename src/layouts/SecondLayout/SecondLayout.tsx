import Suspense from "@/components/Suspense";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Box, Button, CSSObject, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Theme, useTheme } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: theme.spacing(7),
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(8),
  },
});

function SecondLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const togglingCss = open ? openedMixin(theme) : closedMixin(theme);

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="nav" sx={togglingCss}>
        <Drawer
          open={open}
          variant="permanent"
          sx={togglingCss}
          PaperProps={{
            sx: togglingCss,
          }}
          onClose={() => setOpen(false)}>
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={index}>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      <Box sx={{
        flex: 1,
        backgroundColor: "red",
      }}>
        <Button fullWidth onClick={() => setOpen(!open)}>Open drawer</Button>
        <Suspense>
          <Outlet />
        </Suspense>
      </Box>
    </Box>

  );
}

export default SecondLayout;
