import { useAppDispatch, useAppSelector } from "@/hooks";
import AudioFile from "@/models/entities/AudioFile";
import { useGetAudioFilesQuery } from "@/redux/apis/audioFileApi";
import { selectAudioFiles, selectSelectedAudioFileId, setSelectedAudioFileId } from "@/redux/slices/audioFileSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment, ListItem, ListItemButton, ListItemText, styled, TextField, Tooltip, useTheme } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { ChangeEventHandler, ReactNode, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

type VirtualListDataType = {
  audioFiles: AudioFile[];
  selectedId?: number;
  query: string;
};

const StyledFixedSizeList = styled(FixedSizeList<VirtualListDataType>)(({ theme }) => theme.mixins.scrollbar);

function CustomListItem(props: ListChildComponentProps<VirtualListDataType>) {
  const theme = useTheme();
  const { index, style, data } = props;
  const audioFile = data.audioFiles[index];
  const dispatch = useAppDispatch();
  let itemText: ReactNode = audioFile.name;

  if (data.query) {
    const matches = match(audioFile.name, data.query, { insideWords: true, findAllOccurrences: true });
    const parts = parse(audioFile.name, matches);
    itemText = parts.map((part, index) => (
      <Box
        key={index}
        component="span"
        sx={[
          part.highlight && {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.light,
          },
        ]}>
        {part.text}
      </Box>
    ));
  }

  return (
    <ListItem key={audioFile.id} style={style} dense>
      <ListItemButton
        selected={data.selectedId === audioFile.id}
        onClick={() => dispatch(setSelectedAudioFileId(audioFile.id))}>
        <Tooltip title={audioFile.name} placement="right" arrow>
          <ListItemText
            primary={itemText}
            slotProps={{
              primary: {
                sx: {
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                },
              },
            }}
          />
        </Tooltip>
      </ListItemButton>
    </ListItem>
  );
}

function SongsTabPanel() {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState<string>("");
  const deferredSearchValue = useDeferredValue(searchValue);
  const [listHeight, setListHeight] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listSizeObserver = useRef<ResizeObserver>(null);
  const { isFetching, isError } = useGetAudioFilesQuery();
  const audioFiles = useAppSelector(selectAudioFiles);
  const selectedAudioFileId = useAppSelector(selectSelectedAudioFileId);

  const filteredAudioFiles = useMemo(() => {
    if (!deferredSearchValue) return audioFiles;

    return audioFiles.filter((audioFile) => audioFile.name.toLowerCase().includes(deferredSearchValue.toLowerCase()));
  }, [deferredSearchValue, audioFiles]);

  const virtualListData = useMemo<VirtualListDataType>(() => ({
    audioFiles: filteredAudioFiles,
    selectedId: selectedAudioFileId,
    query: deferredSearchValue,
  }), [filteredAudioFiles, selectedAudioFileId, deferredSearchValue]);

  useEffect(() => {
    listSizeObserver.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setListHeight(entry.contentRect.height);
      }
    });
    if (listRef.current) {
      listSizeObserver.current.observe(listRef.current);
    }

    return () => {
      listSizeObserver.current?.disconnect();
    };
  }, []);

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <TextField
        value={searchValue}
        variant="filled"
        label="Search"
        fullWidth
        size="small"
        sx={{
          flexShrink: 0,
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 0,
            },
          },
        }}
        onChange={handleSearchChange}
      />
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          ...theme.mixins.scrollbar,
        }}>
        {isFetching && <Box>Skeleton</Box>}
        {!isFetching && isError && <Box>Error</Box>}
        {!isFetching && !isError && !!filteredAudioFiles.length && <StyledFixedSizeList
          itemSize={36.016}
          height={listHeight}
          itemCount={filteredAudioFiles.length}
          width={300}
          itemData={virtualListData}
        >
          {CustomListItem}
        </StyledFixedSizeList>}
        {!isFetching && !isError && !filteredAudioFiles.length && <Box>Empty</Box>}
      </Box>
    </Box>
  );
}

export default SongsTabPanel;
