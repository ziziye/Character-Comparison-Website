import { Box, Grid, TextField } from "@mui/material";
export default function SearchBar({ search, setSearch }) {
  function handleChange(e) {
    setSearch(e.target.value);
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleChange}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
