import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment, ListItem, ListItemButton, ListItemText, styled, TextField, Tooltip, useTheme } from "@mui/material";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

const StyledFixedSizeList = styled(FixedSizeList)(({ theme }) => theme.mixins.scrollbar);

function CustomListItem(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem key={index} style={style} dense>
      <ListItemButton>
        <Tooltip title={`A Very Long Long Long Song Name #${index}.mp3`} placement="right" arrow>
          <ListItemText
            primary={`A Very Long Long Long Song Name #${index}.mp3`}
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [listHeight, setListHeight] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listSizeObserver = useRef<ResizeObserver>(null);

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
        <StyledFixedSizeList
          itemSize={36.016}
          height={listHeight}
          itemCount={300}
          width={300}
        >
          {CustomListItem}
        </StyledFixedSizeList>
      </Box>
    </Box>
  );
}

export default SongsTabPanel;
