import AudioFileData from "./AudioFileData";

type AudioFile = AudioFileData & {
  path: string;
};

export default AudioFile;
