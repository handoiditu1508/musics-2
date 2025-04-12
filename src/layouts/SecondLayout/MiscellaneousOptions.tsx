import { lgAndUpMediaQuery } from "@/contexts/breakpoints";
import { InfoContext } from "@/contexts/info";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectCooldownTime, selectIsAutoPlay, selectMuted, selectVolume, setCooldownTime, setIsAutoPlay, setMuted, setVolume } from "@/redux/slices/audioFileSlice";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Fade, IconButton, OutlinedInput, Paper, Popper, Slider, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useColorScheme, useTheme } from "@mui/material";
import { ChangeEventHandler, MouseEventHandler, useContext, useId, useState } from "react";

const getVolumeIcon = (volume: number, muted: boolean) => {
  if (muted) {
    return <VolumeOffIcon />;
  }

  if (volume >= 1) {
    return <VolumeUpIcon />;
  }

  if (volume > 0.5) {
    return <VolumeDownIcon />;
  }

  if (volume > 0) {
    return <VolumeMuteIcon />;
  }

  return <VolumeOffIcon />;
};

function MiscellaneousOptions() {
  const theme = useTheme();
  const volume = useAppSelector(selectVolume);
  const muted = useAppSelector(selectMuted);
  const volumeTitle = volume && !muted ? "Volume" : "Muted volume";
  const volumeIcon = getVolumeIcon(volume, muted);
  const [volumeAnchorEl, setVolumeAnchorEl] = useState<HTMLElement | null>(null);
  const volumeOpen = Boolean(volumeAnchorEl);
  const volumeId = useId();
  const isAutoPlay = useAppSelector(selectIsAutoPlay);
  const { mobile } = useContext(InfoContext);
  const [settingOpen, setSettingOpen] = useState(false);
  const settingTitleId = useId();
  const cooldownTime = useAppSelector(selectCooldownTime);
  const { mode, setMode } = useColorScheme();
  const dispatch = useAppDispatch();

  const handleAutoPlayChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(setIsAutoPlay(!isAutoPlay));
  };

  const handleVolumeOpen: MouseEventHandler<HTMLElement> = (event) => {
    setVolumeAnchorEl(event.currentTarget);
  };

  const handleVolumeClose: MouseEventHandler<HTMLElement> = (event) => {
    setVolumeAnchorEl(null);
  };

  const handleVolumeChange = (_event: Event, value: number | number[], _activeThumb: number) => {
    dispatch(setVolume(value as number));
  };

  const handleMutedChange: MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(setMuted(!muted));
  };

  const handleSettingOpen = () => {
    setSettingOpen(true);
  };

  const handleSettingClose = () => {
    setSettingOpen(false);
  };

  const handleCooldownTimeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const timeSeconds = parseFloat(event.currentTarget.value) || 0;
    dispatch(setCooldownTime(timeSeconds * 1000));
  };

  return (
    <Box sx={{
      flexGrow: 0,
      flexShrink: 1,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      gap: 1,
      [lgAndUpMediaQuery(theme.breakpoints)]: {
        flexBasis: 300,
      },
    }}>
      <Tooltip title="Auto play" placement="top">
        <Checkbox
          checked={isAutoPlay}
          inputProps={{ "aria-label": "Auto play" }}
          icon={<AutoModeIcon />}
          checkedIcon={<AutoModeIcon />}
          onChange={handleAutoPlayChange}
        />
      </Tooltip>

      <Box
        {...(!mobile && {
          onMouseEnter: handleVolumeOpen,
          onMouseLeave: handleVolumeClose,
        })}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          aria-label={volumeTitle}
          aria-describedby={volumeId}
          onClick={handleMutedChange}>
          {volumeIcon}
        </IconButton>
        {mobile && <Slider
          min={0}
          max={1}
          value={muted ? 0 : volume}
          step={0.1}
          sx={{ width: 100 }}
          onChange={handleVolumeChange}
        />}
        {!mobile && <Popper
          id={volumeId}
          open={volumeOpen}
          anchorEl={volumeAnchorEl}
          transition
          placement="top"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
          }}>
          {({ TransitionProps }) => (
            <Fade
              {...TransitionProps}
              timeout={{
                enter: theme.transitions.duration.shortest,
                exit: theme.transitions.duration.long,
              }}>
              <Paper
                elevation={3}
                sx={{
                  padding: theme.spacing(2, 1),
                }}>
                <Slider
                  min={0}
                  max={1}
                  value={muted ? 0 : volume}
                  step={0.1}
                  orientation="vertical"
                  sx={{ height: 100 }}
                  onChange={handleVolumeChange}
                />
              </Paper>
            </Fade>
          )}
        </Popper>}
      </Box>

      <Tooltip title="Setting" placement="top">
        <IconButton aria-label="Setting" edge="end" onClick={handleSettingOpen}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={settingOpen}
        aria-labelledby={settingTitleId}
        keepMounted={false}
        onClose={handleSettingClose}>
        <DialogTitle id={settingTitleId}>Setting</DialogTitle>
        <DialogContent>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
            }}>
            <tbody>
              <Box
                component="tr"
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  td: { paddingBottom: 1 },
                }}>
                <Box component="td" sx={{ paddingRight: 1 }}>
                  <Typography>Timeout between songs</Typography>
                </Box>
                <Box component="td" sx={{ textAlign: "right" }}>
                  <OutlinedInput
                    value={cooldownTime / 1000}
                    size="small"
                    type="number"
                    onChange={handleCooldownTimeChange}
                  />
                </Box>
              </Box>
              <Box
                component="tr"
                sx={{
                  td: { paddingTop: 1 },
                }}>
                <Box component="td" sx={{ paddingRight: 1 }}>
                  <Typography>Mode</Typography>
                </Box>
                <Box component="td" sx={{ textAlign: "right" }}>
                  <ToggleButtonGroup value={mode} color="primary" fullWidth aria-label="toggle button group" size="small">
                    <ToggleButton value="light" onClick={() => setMode("light")}><LightModeIcon /></ToggleButton>
                    <ToggleButton value="system" onClick={() => setMode("system")}><SettingsBrightnessIcon /></ToggleButton>
                    <ToggleButton value="dark" onClick={() => setMode("dark")}><DarkModeIcon /></ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
            </tbody>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MiscellaneousOptions;
