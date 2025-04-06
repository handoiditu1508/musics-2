import { formatSeconds } from "@/common/formats";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectIsAudioFilesShuffled, selectSelectedAudioFile, shuffleAudioFiles, unShuffleAudioFiles } from "@/redux/slices/audioFileSlice";
import Forward10Icon from "@mui/icons-material/Forward10";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import Replay10Icon from "@mui/icons-material/Replay10";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Box, Checkbox, IconButton, Slider, Tooltip, Typography, sliderClasses, useTheme } from "@mui/material";
import { useState } from "react";

function AudioPlayer() {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playButtonTitle = isPlaying ? "Pause" : "Play";
  const selectedAudioFile = useAppSelector(selectSelectedAudioFile);
  const isShuffled = useAppSelector(selectIsAudioFilesShuffled);
  const audioDuration = selectedAudioFile ? selectedAudioFile.duration : 0;
  const dispatch = useAppDispatch();

  const handleShuffleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (!checked) {
      dispatch(unShuffleAudioFiles());
    } else {
      dispatch(shuffleAudioFiles());
    }
  };

  return (
    <Box sx={{
      flex: 1,
      maxWidth: 600,
    }}>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
      >
        <Tooltip title="Shuffle" placement="top">
          <Checkbox
            inputProps={{ "aria-label": "Shuffle" }}
            icon={<ShuffleIcon />}
            checkedIcon={<ShuffleOnIcon />}
            checked={isShuffled}
            onChange={handleShuffleChange}
          />
        </Tooltip>
        <Tooltip title="Previous" placement="top">
          <IconButton aria-label="Previous">
            <SkipPreviousIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Replay 10 seconds" placement="top">
          <IconButton aria-label="Replay 10 seconds">
            <Replay10Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title={playButtonTitle} placement="top">
          <IconButton aria-label={playButtonTitle} color="primary" size="large" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <PauseIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Forward 10 seconds" placement="top">
          <IconButton aria-label="Forward 10 seconds">
            <Forward10Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next" placement="top">
          <IconButton aria-label="Next">
            <SkipNextIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Repeat" placement="top">
          <Checkbox
            inputProps={{ "aria-label": "Repeat" }}
            icon={<RepeatIcon />}
            checkedIcon={<RepeatOnIcon />}
          />
        </Tooltip>
      </Box>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}>
        <Typography variant="caption">2:30</Typography>
        <Slider
          aria-label="Music player"
          valueLabelDisplay="auto"
          max={audioDuration}
          valueLabelFormat={formatSeconds}
          sx={{
            [`.${sliderClasses.thumb}`]: {
              width: 8,
              height: 8,
              transition: theme.transitions.create(["box-shadow", "left", "bottom", "width", "height"], {
                duration: theme.transitions.duration.shortest,
                easing: theme.transitions.easing.easeInOut,
              }),
              [`&.${sliderClasses.active}`]: {
                width: 20,
                height: 20,
              },
            },
          }}
        />
        <Typography variant="caption">{formatSeconds(audioDuration)}</Typography>
      </Box>
    </Box>
  );
}

export default AudioPlayer;
