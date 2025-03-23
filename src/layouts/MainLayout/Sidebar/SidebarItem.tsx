import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, To, useMatch, useResolvedPath } from "react-router-dom";

export type SidebarTab = {
  title: string;
  to: To;
  icon?: JSX.Element;
  children?: SidebarTab[];
};

type SidebarItemProps = {
  sidebarTab: SidebarTab;
  level?: number;
  hideChilds?: boolean;
};

export default function SidebarItem({ sidebarTab, level = 0, hideChilds }: SidebarItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [leftPadding] = useState<number>(theme.constants.sidebarLeftPadding || 0);
  const resolved = useResolvedPath(sidebarTab.to);
  const fullyMatch = useMatch({ path: resolved.pathname, end: true });
  const partialMatch = useMatch({ path: resolved.pathname, end: false });
  const [open, setOpen] = useState<boolean>(!!partialMatch);

  const handleClickItem = () => {
    setOpen(!open);
  };

  const handleClickExpandIcon: React.MouseEventHandler<SVGSVGElement> = (event) => {
    // collapse child without open the link
    event.preventDefault();
    setOpen(!open);
  };

  return (
    <>
      <ListItem>
        <ListItemButton component={Link} selected={!!fullyMatch} to={sidebarTab.to} style={{ paddingLeft: leftPadding + (level * theme.constants.scalingFactor) }} onClick={handleClickItem}>
          {sidebarTab.icon && <ListItemIcon>
            {sidebarTab.icon}
          </ListItemIcon>}
          <ListItemText primary={t(sidebarTab.title)} />
          {sidebarTab.children && sidebarTab.children.length !== 0 && <ExpandMoreIcon
            sx={{
              transform: open ? "rotate(180deg)" : undefined,
              transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.short,
                easing: theme.transitions.easing.sharp,
              }),
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
            onClick={handleClickExpandIcon}
          />}
        </ListItemButton>
      </ListItem>
      {sidebarTab.children && sidebarTab.children.length !== 0 && <Collapse in={open && !hideChilds} unmountOnExit>
        <List disablePadding dense>
          {sidebarTab.children.map((child) => <SidebarItem key={child.title} sidebarTab={child} level={level + 1} hideChilds={hideChilds} />)}
        </List>
      </Collapse>}
    </>
  );
}
