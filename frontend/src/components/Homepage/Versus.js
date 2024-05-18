import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

export default function Versus({ name, src }) {
  return (
    <Grid container width={240}>
      <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6" gutterBottom color="white">
          {name}
        </Typography>
      </Grid>
      <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
        <Avatar alt="Remy Sharp" src={src} sx={{ width: 160, height: 160 }} />
      </Grid>
    </Grid>
  );
}
