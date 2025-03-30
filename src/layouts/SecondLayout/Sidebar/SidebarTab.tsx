import FaSvgIcon from "@/components/FaSvgIcon";
import { faFaceKissWinkHeart } from "@fortawesome/free-solid-svg-icons/faFaceKissWinkHeart";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { Box, Tab, TabProps, Tabs } from "@mui/material";
import { useState } from "react";

type TabItem = {
  id: number;
  tabId: string;
  tabPanelId: string;
} & Pick<TabProps, "label" | "icon" | "iconPosition">;

const tabItems: TabItem[] = [
  {
    id: 0,
    label: "Songs",
    tabId: "sidebar-tab-0",
    tabPanelId: "sidebar-tabpanel-0",
    icon: <FaSvgIcon icon={faMusic} />,
    iconPosition: "start",
  },
  {
    id: 1,
    label: "Artists",
    tabId: "sidebar-tab-1",
    tabPanelId: "sidebar-tabpanel-1",
    icon: <FaSvgIcon icon={faFaceKissWinkHeart} />,
    iconPosition: "end",
  },
];

function SidebarTab() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
          aria-labelledby={item.tabId}>
          {tabValue === item.id && <Box>{item.label}</Box>}
        </Box>
      ))}
    </Box>
  );
}

export default SidebarTab;
