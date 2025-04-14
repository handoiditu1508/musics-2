import { BreakpointsContext, smAndUpMediaQuery } from "@/contexts/breakpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectCurrentTimeoutDuration, selectCurrentTimeoutId, setCurrentTimeout } from "@/redux/slices/audioFileSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, ButtonBase, CircularProgress, Fade, svgIconClasses, Typography, typographyClasses, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";

function NextSongTimeoutProgress() {
  const theme = useTheme();
  const [progress, setProgress] = useState<number>(0);
  const [countDown, setCountDown] = useState<number>(0);
  const currentTimeoutId = useAppSelector(selectCurrentTimeoutId);
  const currentTimeoutDuration = useAppSelector(selectCurrentTimeoutDuration);
  const { xs } = useContext(BreakpointsContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentTimeoutId) {
      const addition = 1000 * 100 / currentTimeoutDuration;
      setProgress(addition);
      setCountDown(Math.round(currentTimeoutDuration / 1000));

      const timer = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + addition, 100));
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTimeoutId]);

  const handleCancelNextSongTimeout = () => {
    clearTimeout(currentTimeoutId);
    dispatch(setCurrentTimeout({
      duration: 0,
    }));
  };

  return (
    <Fade
      in={Boolean(currentTimeoutId)}
      addEndListener={() => {
        if (!currentTimeoutId) {
          setProgress(0);
        }
      }}>
      <ButtonBase
        sx={{
          borderRadius: "50%",
          [`.${svgIconClasses.root}`]: {
            display: "none",
          },
          ":hover": {
            [`.${typographyClasses.root}`]: {
              display: "none",
            },
            [`.${svgIconClasses.root}`]: {
              display: "inline-block",
            },
          },
          [smAndUpMediaQuery(theme.breakpoints)]: {
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          },
        }}
        onClick={handleCancelNextSongTimeout}>
        <CircularProgress variant="determinate" value={progress} size={xs ? 24 : undefined} />
        <Box sx={{
          position: "absolute",
          display: "flex",
        }}>
          <Typography variant={xs ? "body2" : undefined}>{countDown}</Typography>
          <CancelIcon color="error" />
        </Box>
      </ButtonBase>
    </Fade>
  );
}

export default NextSongTimeoutProgress;
