import { styled, Typography } from "@mui/material";

const StyledTable = styled("table")(({ theme }) => ({
  maxWidth: 400,
  margin: `${theme.spacing(1)} auto 0`,
  borderCollapse: "separate",
  borderSpacing: theme.spacing(1),
}));

function HomePage() {
  return (
    <StyledTable>
      <tr>
        <td><Typography>File Name.mp3</Typography></td>
        <td><Typography variant="body2">5Mb</Typography></td>
      </tr>
      <tr>
        <td><Typography>Song Name</Typography></td>
        <td><Typography variant="body2">5:10</Typography></td>
      </tr>
      <tr>
        <td><Typography>Artist 1, Artist 2, Artist 3, Artist 4, Artist 5, Artist 6, Artist 7</Typography></td>
      </tr>
    </StyledTable>
  );
}

export default HomePage;
