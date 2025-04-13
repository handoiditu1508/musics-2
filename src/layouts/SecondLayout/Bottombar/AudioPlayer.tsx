import { formatSeconds } from "@/common/formats";
import { lgAndUpMediaQuery, mdAndDownMediaQuery, smAndUpMediaQuery, xsMediaQuery } from "@/contexts/breakpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { nextAudio, previousAudio, selectAudioFiles, selectCooldownTime, selectIsAudioFilesShuffled, selectIsAutoPlay, selectMuted, selectSelectedAudioFile, selectVolume, shuffleAudioFiles, unShuffleAudioFiles } from "@/redux/slices/audioFileSlice";
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
import { CSSProperties, ReactEventHandler, useEffect, useRef, useState } from "react";
import NextSongTimeoutProgress from "./NextSongTimeoutProgress";

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
  const [isRepeat, setIsRepeat] = useState(true);
  const audioFiles = useAppSelector(selectAudioFiles);
  const isLastInList = selectedAudioFile === audioFiles.at(-1);
  const volume = useAppSelector(selectVolume);
  const muted = useAppSelector(selectMuted);
  const cooldownTime = useAppSelector(selectCooldownTime);
  const nextSongTimeoutId = useRef<NodeJS.Timeout>(undefined);
  const [currentTimeout, setCurrentTimeout] = useState<{
    timeoutId?: NodeJS.Timeout | string | number;
    /**
     * Miliseconds.
     */
    time: number;
  }>({
    time: 0,
  });
  const dispatch = useAppDispatch();

  const handleShuffleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (!checked) {
      dispatch(unShuffleAudioFiles());
    } else {
      dispatch(shuffleAudioFiles());
    }
  };

  const handlePlayButtonClick = () => {
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
    const currentTime = Math.min(audioRef.current.currentTime, audioDuration);

    setCurrentTime(currentTime);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setPositionState({
        duration: audioDuration,
        position: currentTime,
      });
    }
  };

  const handleProgress: ReactEventHandler<HTMLAudioElement> = () => {
    if (audioRef.current.buffered.length) {
      setBufferedTime(audioRef.current.buffered.end(audioRef.current.buffered.length - 1));
    }
  };

  const handleEnded: ReactEventHandler<HTMLAudioElement> = () => {
    if (isAutoPlay) {
      if (isLastInList && !isRepeat) {
        return;
      }

      // schedule next song or play next song immediately
      if (cooldownTime) {
        nextSongTimeoutId.current = setTimeout(() => {
          dispatch(nextAudio());
        }, cooldownTime);

        setCurrentTimeout({
          timeoutId: nextSongTimeoutId.current,
          time: cooldownTime,
        });
      } else {
        dispatch(nextAudio());
      }
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

  const handleRepeatChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setIsRepeat(checked);
  };

  const handleCancelNextSongTimeout = () => {
    clearTimeout(nextSongTimeoutId.current);
    setCurrentTimeout({ time: 0 });
  };

  // handle song change
  useEffect(() => {
    if (selectedAudioFile) {
      // reset states
      setCurrentTime(0);
      setBufferedTime(0);

      // clear next song timeout
      clearTimeout(nextSongTimeoutId.current);
      setCurrentTimeout({ time: 0 });

      // update media controls api
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setPositionState({
          duration: audioDuration,
          position: 0,
        });

        navigator.mediaSession.metadata = new MediaMetadata({
          title: selectedAudioFile.title,
          artist: selectedAudioFile.artists.join(", "),
          album: "My playlist",
          artwork: [
            {
              src: "favicon.ico",
              sizes: "64x64 32x32 24x24 16x16",
              type: "image/x-icon",
            },
            {
              src: "logo192.png",
              type: "image/png",
              sizes: "192x192",
            },
            {
              src: "logo512.png",
              type: "image/png",
              sizes: "512x512",
            },
          ],
        });
      }

      // play
      audioRef.current.play().catch(handlePlayAbortError);
    } else {
      audioRef.current.pause();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAudioFile]);

  // handle volume change
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("nexttrack", handleNextButtonClick);
    navigator.mediaSession.setActionHandler("previoustrack", handlePreviousButtonClick);
    navigator.mediaSession.setActionHandler("pause", handlePlayButtonClick);
    navigator.mediaSession.setActionHandler("play", handlePlayButtonClick);
    navigator.mediaSession.setActionHandler("seekbackward", handleReplayButtonClick);
    navigator.mediaSession.setActionHandler("seekforward", handleForwardButtonClick);
  }

  return (
    <Box sx={{
      flex: 1,
      [mdAndDownMediaQuery(theme.breakpoints)]: {
        paddingX: 1,
      },
      [lgAndUpMediaQuery(theme.breakpoints)]: {
        maxWidth: 600,
      },
    }}>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        [xsMediaQuery(theme.breakpoints)]: {
          justifyContent: "space-between",
        },
        [smAndUpMediaQuery(theme.breakpoints)]: {
          justifyContent: "center",
          gap: 1,
        },
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
            checked={isRepeat}
            onChange={handleRepeatChange}
          />
        </Tooltip>
        <NextSongTimeoutProgress
          timeoutId={currentTimeout.timeoutId}
          time={currentTimeout.time}
          onCancel={handleCancelNextSongTimeout}
        />
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
          muted={muted}
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
