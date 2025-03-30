import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, TextField, Tooltip, useTheme } from "@mui/material";
import { ChangeEventHandler, useState } from "react";

function SongsTabPanel() {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        ...theme.mixins.scrollbar,
      }}>
        <List dense>
          {[...Array(22)].map((_, index) => (
            <ListItem key={index}>
              <ListItemButton selected={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
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
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default SongsTabPanel;
