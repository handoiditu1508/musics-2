import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetAudioFilesQuery } from "@/redux/apis/audioFileApi";
import { selectQueriedAudioFiles, selectQuery, selectSelectedAudioFileId, updateQuery, updateSelectedAudioFileId } from "@/redux/slices/audioFileSlice";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, Skeleton, styled, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { ChangeEventHandler, ReactNode, useDeferredValue, useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

const StyledFixedSizeList = styled(FixedSizeList)(({ theme }) => theme.mixins.scrollbar);

function CustomListItem(props: ListChildComponentProps) {
  const theme = useTheme();
  const { index, style } = props;
  const audioFiles = useAppSelector(selectQueriedAudioFiles);
  const audioFile = audioFiles[index];
  const query = useAppSelector(selectQuery);
  const selectedId = useAppSelector(selectSelectedAudioFileId);
  const dispatch = useAppDispatch();
  let itemText: ReactNode = audioFile.name;

  if (query) {
    const matches = match(audioFile.name, query, { insideWords: true, findAllOccurrences: true });
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
        selected={selectedId === audioFile.id}
        onClick={() => dispatch(updateSelectedAudioFileId(audioFile.id))}>
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
  const query = useAppSelector(selectQuery);
  const [searchValue, setSearchValue] = useState<string>(query);
  const deferredSearchValue = useDeferredValue(searchValue);
  const [listHeight, setListHeight] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listSizeObserver = useRef<ResizeObserver>(null);
  const { isFetching, isError, refetch } = useGetAudioFilesQuery();
  const filteredAudioFiles = useAppSelector(selectQueriedAudioFiles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateQuery(deferredSearchValue));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearchValue]);

  useEffect(() => {
    // handle update query from outside
    if (query !== deferredSearchValue) {
      setSearchValue(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

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
                {
                  searchValue
                    ? (
                      <IconButton edge="end" onClick={() => setSearchValue("")}>
                        <ClearIcon />
                      </IconButton>
                    )
                    : <SearchIcon />
                }
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
        {/* todo: skeleton, error, empty */}
        {isFetching && <List dense disablePadding>
          {Array.from({ length: 30 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="100%" sx={{ marginTop: 1 }}>
              <ListItem>
                <ListItemText
                  primary="."
                />
              </ListItem>
            </Skeleton>
          ))}
        </List>}
        {!isFetching && isError && <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}>
          <Typography>Error loading audio files!</Typography>
          <Button variant="text" startIcon={<RefreshIcon />} onClick={refetch}>
            Reload
          </Button>
        </Box>}
        {!isFetching && !isError && !!filteredAudioFiles.length && <StyledFixedSizeList
          itemSize={36.016}
          height={listHeight}
          itemCount={filteredAudioFiles.length}
          width={300}
        >
          {CustomListItem}
        </StyledFixedSizeList>}
        {!isFetching && !isError && !filteredAudioFiles.length && <Box>Empty</Box>}
      </Box>
    </Box>
  );
}

export default SongsTabPanel;
