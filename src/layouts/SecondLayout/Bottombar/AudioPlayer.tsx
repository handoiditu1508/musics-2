import { formatSeconds } from "@/common/formats";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { nextAudio, previousAudio, selectIsAudioFilesShuffled, selectIsAutoPlay, selectSelectedAudioFile, shuffleAudioFiles, unShuffleAudioFiles } from "@/redux/slices/audioFileSlice";
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
import { CSSProperties, MouseEventHandler, ReactEventHandler, useEffect, useRef, useState } from "react";

const handlePlayAbortError = (error: Error) => {
  if (error.name !== "AbortError") {
    console.error(error);
  }
};

function AudioPlayer() {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playButtonTitle = isPlaying ? "Pause" : "Play";
  const selectedAudioFile = useAppSelector(selectSelectedAudioFile);
  const isShuffled = useAppSelector(selectIsAudioFilesShuffled);
  const audioDuration = selectedAudioFile ? selectedAudioFile.duration : 0;
  const audioRef = useRef<HTMLAudioElement>({} as HTMLAudioElement);
  const [currentTime, setCurrentTime] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const isAutoPlay = useAppSelector(selectIsAutoPlay);
  const dispatch = useAppDispatch();

  const handleShuffleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (!checked) {
      dispatch(unShuffleAudioFiles());
    } else {
      dispatch(shuffleAudioFiles());
    }
  };

  const handlePlayButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (audioRef.current.paused) {
      if (audioRef.current.currentSrc) {
        audioRef.current.play().catch(handlePlayAbortError);
      }
    } else {
      audioRef.current.pause();
    }
  };

  const handlePlay: ReactEventHandler<HTMLAudioElement> = () => {
    setIsPlaying(true);
  };

  const handlePause: ReactEventHandler<HTMLAudioElement> = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate: ReactEventHandler<HTMLAudioElement> = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgress: ReactEventHandler<HTMLAudioElement> = () => {
    if (audioRef.current.buffered.length) {
      setBufferedTime(audioRef.current.buffered.end(audioRef.current.buffered.length - 1));
    }
  };

  const handleEnded: ReactEventHandler<HTMLAudioElement> = () => {
    if (isAutoPlay) {
      dispatch(nextAudio());
    }
  };

  const handleSliderChange = (_event: Event, value: number | number[], _activeThumb: number) => {
    audioRef.current.currentTime = value as number;
  };

  const handleNextButtonClick = () => {
    dispatch(nextAudio());
  };

  const handlePreviousButtonClick = () => {
    dispatch(previousAudio());
  };

  const handleReplayButtonClick = () => {
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };

  const handleForwardButtonClick = () => {
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioDuration);
  };

  // handle song change
  useEffect(() => {
    if (selectedAudioFile) {
      setCurrentTime(0);
      setBufferedTime(0);
      audioRef.current.play().catch(handlePlayAbortError);
    } else {
      audioRef.current.pause();
    }
  }, [selectedAudioFile]);

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
          <IconButton aria-label="Previous" onClick={handlePreviousButtonClick}>
            <SkipPreviousIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Replay 10 seconds" placement="top">
          <IconButton aria-label="Replay 10 seconds" onClick={handleReplayButtonClick}>
            <Replay10Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title={playButtonTitle} placement="top">
          <IconButton aria-label={playButtonTitle} color="primary" size="large" onClick={handlePlayButtonClick}>
            {isPlaying ? <PauseIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Forward 10 seconds" placement="top">
          <IconButton aria-label="Forward 10 seconds" onClick={handleForwardButtonClick}>
            <Forward10Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next" placement="top">
          <IconButton aria-label="Next" onClick={handleNextButtonClick}>
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
        <Typography variant="caption">{formatSeconds(currentTime)}</Typography>
        <Slider
          aria-label="Music player"
          valueLabelDisplay="auto"
          value={currentTime}
          max={audioDuration}
          valueLabelFormat={formatSeconds}
          style={{
            "--bufferedPercent": `${bufferedTime * 100 / audioDuration}%`,
          } as CSSProperties}
          sx={{
            [`.${sliderClasses.rail}`]: {
              backgroundColor: theme.palette.Slider.primaryTrack,
              "::before": {
                height: "inherit",
                position: "absolute",
                top: "inherit",
                content: '""',
                width: "var(--bufferedPercent)",
                borderRadius: "inherit",
                transform: "inherit",
                backgroundColor: theme.palette.primary.main,
              },
            },
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
          onChange={handleSliderChange}
        />
        <Typography variant="caption">{formatSeconds(audioDuration)}</Typography>
        <audio
          ref={audioRef}
          src={selectedAudioFile ? selectedAudioFile.path : undefined}
          style={{ display: "none" }}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onProgress={handleProgress}
          onEnded={handleEnded}
        />
      </Box>
    </Box>
  );
}

export default AudioPlayer;
