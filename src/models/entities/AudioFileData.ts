type AudioFileData = {
  id: number;
  name: string;
  title: string;
  artists: string[];
  size: number;
  duration: number;
  lyricsFile?: string;
};

export default AudioFileData;
