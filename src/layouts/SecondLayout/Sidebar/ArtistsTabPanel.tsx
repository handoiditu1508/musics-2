import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetAudioFilesQuery } from "@/redux/apis/audioFileApi";
import { selectArtists, updateArtistQuery } from "@/redux/slices/audioFileSlice";
import { updateTabValue } from "@/redux/slices/secondLayoutSlice";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, Skeleton, styled, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { ChangeEventHandler, ReactNode, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

type VirtualListType = {
  artistQuery: string;
  artists: string[];
};

const StyledFixedSizeList = styled(FixedSizeList<VirtualListType>)(({ theme }) => theme.mixins.scrollbar);

function CustomListItem(props: ListChildComponentProps<VirtualListType>) {
  const theme = useTheme();
  const { index, style, data } = props;
  const artist = data.artists[index];
  const query = data.artistQuery;
  const dispatch = useAppDispatch();
  let itemText: ReactNode = artist;

  if (query) {
    const matches = match(artist, query, { insideWords: true, findAllOccurrences: true });
    const parts = parse(artist, matches);
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

  const handleSelectArtist = () => {
    dispatch(updateArtistQuery(artist));
    dispatch(updateTabValue(0));
  };

  return (
    <ListItem key={artist} style={style} dense>
      <ListItemButton
        onClick={handleSelectArtist}>
        <Tooltip title={artist} placement="right" arrow>
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

function ArtistsTabPanel() {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState<string>("");
  const deferredSearchValue = useDeferredValue(searchValue);
  const [listHeight, setListHeight] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listSizeObserver = useRef<ResizeObserver>(null);
  const { isFetching, isError, refetch } = useGetAudioFilesQuery();
  const artists = useAppSelector(selectArtists);
  const lowerCaseSearchValue = deferredSearchValue.toLowerCase();
  const queriedArtists = useMemo(() => lowerCaseSearchValue ? artists.filter((artist) => artist.toLowerCase().includes(lowerCaseSearchValue)) : artists, [artists, lowerCaseSearchValue]);

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
        {!isFetching && !isError && !!queriedArtists.length && <StyledFixedSizeList
          itemSize={36.016}
          height={listHeight}
          itemCount={queriedArtists.length}
          width="100%"
          itemData={{
            artistQuery: deferredSearchValue,
            artists: queriedArtists,
          }}
        >
          {CustomListItem}
        </StyledFixedSizeList>}
        {!isFetching && !isError && !queriedArtists.length && <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}>
          <Typography>No artist found!</Typography>
        </Box>}
      </Box>
    </Box>
  );
}

export default ArtistsTabPanel;
