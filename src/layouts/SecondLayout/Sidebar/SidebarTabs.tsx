import FaSvgIcon from "@/components/FaSvgIcon";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectBottomHeight, selectTabValue, updateTabValue } from "@/redux/slices/secondLayoutSlice";
import { faFaceKissWinkHeart } from "@fortawesome/free-solid-svg-icons/faFaceKissWinkHeart";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { Box, Tab, TabProps, Tabs } from "@mui/material";
import ArtistsTabPanel from "./ArtistsTabPanel";
import SongsTabPanel from "./SongsTabPanel";

type TabItem = {
  id: number;
  tabId: string;
  tabPanelId: string;
  tabPanel: React.ReactNode;
} & Pick<TabProps, "label" | "icon" | "iconPosition">;

const tabItems: TabItem[] = [
  {
    id: 0,
    label: "Songs",
    tabId: "sidebar-tab-0",
    tabPanelId: "sidebar-tabpanel-0",
    icon: <FaSvgIcon icon={faMusic} />,
    iconPosition: "start",
    tabPanel: <SongsTabPanel />,
  },
  {
    id: 1,
    label: "Artists",
    tabId: "sidebar-tab-1",
    tabPanelId: "sidebar-tabpanel-1",
    icon: <FaSvgIcon icon={faFaceKissWinkHeart} />,
    iconPosition: "end",
    tabPanel: <ArtistsTabPanel />,
  },
];

function SidebarTabs() {
  const tabValue = useAppSelector(selectTabValue);
  const bottomHeight = useAppSelector(selectBottomHeight);
  const dispatch = useAppDispatch();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    dispatch(updateTabValue(newValue));
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: `calc(100vh - ${bottomHeight}px)`,
      marginBottom: `${bottomHeight}px`,
    }}>
      <Box sx={{
        borderBottom: 1,
        borderColor: "divider",
        flexShrink: 0,
      }}>
        <Tabs
          value={tabValue}
          variant="fullWidth"
          aria-label="sidebar tabs"
          onChange={handleTabChange}>
          {tabItems.map((item) => (
            <Tab
              key={item.id}
              label={item.label}
              id={item.tabId}
              icon={item.icon}
              iconPosition={item.iconPosition}
              aria-controls={item.tabPanelId}
              sx={{
                justifyContent: "space-between",
              }}
            />
          ))}
        </Tabs>
      </Box>
      {tabItems.map((item) => (
        <Box
          key={item.id}
          hidden={tabValue !== item.id}
          role="tabpanel"
          id={item.tabPanelId}
          aria-labelledby={item.tabId}
          sx={{
            flex: 1,
            overflowY: "hidden",
          }}>
          {item.tabPanel}
        </Box>
      ))}
    </Box>
  );
}

export default SidebarTabs;
