import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectIsAutoPlay, setIsAutoPlay } from "@/redux/slices/audioFileSlice";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, Checkbox, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

const getVolumeIcon = (volume: number) => {
  if (volume >= 100) {
    return <VolumeUpIcon />;
  }

  if (volume > 50) {
    return <VolumeDownIcon />;
  }

  if (volume > 0) {
    return <VolumeMuteIcon />;
  }

  return <VolumeOffIcon />;
};

function MiscellaneousOptions() {
  const [volume, setVolume] = useState<number>(100);
  const volumeTitle = volume ? "Volume" : "Muted volume";
  const volumeIcon = getVolumeIcon(100);
  const isAutoPlay = useAppSelector(selectIsAutoPlay);
  const dispatch = useAppDispatch();

  const handleAutoPlayChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(setIsAutoPlay(!isAutoPlay));
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
      <Tooltip title={volumeTitle} placement="top">
        <IconButton aria-label={volumeTitle}>
          {volumeIcon}
        </IconButton>
      </Tooltip>
      <Tooltip title="More options" placement="top">
        <IconButton aria-label="More options">
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default MiscellaneousOptions;
