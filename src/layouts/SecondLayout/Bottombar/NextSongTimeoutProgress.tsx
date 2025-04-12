import CancelIcon from "@mui/icons-material/Cancel";
import { Box, ButtonBase, CircularProgress, Fade, svgIconClasses, Typography, typographyClasses } from "@mui/material";
import { useEffect, useState } from "react";

type NextSongTimeoutProgressProps = {
  timeoutId?: NodeJS.Timeout | string | number;
  time: number;
  onCancel?: () => void;
};

function NextSongTimeoutProgress({ timeoutId, time, onCancel }: NextSongTimeoutProgressProps) {
  const [progress, setProgress] = useState<number>(0);
  const [countDown, setCountDown] = useState<number>(0);

  useEffect(() => {
    if (timeoutId) {
      const addition = 1000 * 100 / time;
      setProgress(addition);
      setCountDown(Math.round(time / 1000));

      const timer = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + addition, 100));
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutId]);

  return (
    <Fade
      in={Boolean(timeoutId)}
      addEndListener={() => {
        if (!timeoutId) {
          setProgress(0);
        }
      }}>
      <ButtonBase
        sx={{
          borderRadius: "50%",
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
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
        }}
        onClick={onCancel}>
        <CircularProgress variant="determinate" value={progress} />
        <Box sx={{
          position: "absolute",
          display: "flex",
        }}>
          <Typography>{countDown}</Typography>
          <CancelIcon color="error" />
        </Box>
      </ButtonBase>
    </Fade>
  );
}

export default NextSongTimeoutProgress;
