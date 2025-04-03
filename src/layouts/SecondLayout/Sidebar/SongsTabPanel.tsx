import { useAppDispatch, useAppSelector } from "@/hooks";
import AudioFile from "@/models/entities/AudioFile";
import { useGetAudioFilesQuery } from "@/redux/apis/audioFileApi";
import { selectAudioFiles, selectSelectedAudioFileId, setSelectedAudioFileId } from "@/redux/slices/audioFileSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment, ListItem, ListItemButton, ListItemText, styled, TextField, Tooltip, useTheme } from "@mui/material";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

const StyledFixedSizeList = styled(FixedSizeList<AudioFile[]>)(({ theme }) => theme.mixins.scrollbar);

function CustomListItem(props: ListChildComponentProps<AudioFile[]>) {
  const { index, style, data } = props;
  const audioFile = data[index];
  const selectedAudioFileId = useAppSelector(selectSelectedAudioFileId);
  const dispatch = useAppDispatch();

  return (
    <ListItem key={audioFile.id} style={style} dense>
      <ListItemButton
        selected={selectedAudioFileId === audioFile.id}
        onClick={() => dispatch(setSelectedAudioFileId(audioFile.id))}>
        <Tooltip title={audioFile.name} placement="right" arrow>
          <ListItemText
            primary={audioFile.name}
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
  const [listHeight, setListHeight] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listSizeObserver = useRef<ResizeObserver>(null);
  const { isFetching, isError } = useGetAudioFilesQuery();
  const audioFiles = useAppSelector(selectAudioFiles);

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
        {!isFetching && !isError && audioFiles.length && <StyledFixedSizeList
          itemSize={36.016}
          height={listHeight}
          itemCount={300}
          width={300}
          itemData={audioFiles}
        >
          {CustomListItem}
        </StyledFixedSizeList>}
        {!isFetching && !isError && !audioFiles.length && <Box>Empty</Box>}
      </Box>
    </Box>
  );
}

export default SongsTabPanel;
