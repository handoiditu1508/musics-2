import { InfoContext } from "@/contexts/info";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectIsAutoPlay, selectMuted, selectVolume, setIsAutoPlay, setMuted, setVolume } from "@/redux/slices/audioFileSlice";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, Checkbox, Fade, IconButton, Paper, Popper, Slider, Tooltip, useTheme } from "@mui/material";
import { MouseEventHandler, useContext, useId, useState } from "react";

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
  const dispatch = useAppDispatch();

  const handleAutoPlayChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(setIsAutoPlay(!isAutoPlay));
  };

  const handleOpenVolume: MouseEventHandler<HTMLElement> = (event) => {
    setVolumeAnchorEl(event.currentTarget);
  };

  const handleCloseVolume: MouseEventHandler<HTMLElement> = (event) => {
    setVolumeAnchorEl(null);
  };

  const handleVolumeChange = (_event: Event, value: number | number[], _activeThumb: number) => {
    dispatch(setVolume(value as number));
  };

  const handleMutedChange: MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(setMuted(!muted));
  };

  return (
    <Box sx={{
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 300,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      gap: 1,
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
          onMouseEnter: handleOpenVolume,
          onMouseLeave: handleCloseVolume,
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

      <Tooltip title="More options" placement="top">
        <IconButton aria-label="More options">
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default MiscellaneousOptions;
