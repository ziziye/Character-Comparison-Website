import Grid from "@mui/material/Unstable_Grid2";
import Versus from "./Versus";
import { Typography } from "@mui/material";
export default function VersusBanner({ name0, src0, name1, src1 }) {
  return (
    <Grid container bgcolor="text.primary" p={2}>
      <Grid xs={5} display="flex" justifyContent="right" alignItems="center">
        <Versus name={name0} src={src0} />
      </Grid>
      <Grid xs={2} display="flex" justifyContent="center" alignItems="center">
        <item>
          <Typography variant="h2" color="white">
            VS
          </Typography>
        </item>
      </Grid>
      <Grid xs={5} display="flex" justifyContent="left" alignItems="center">
        <Versus name={name1} src={src1} />
      </Grid>
    </Grid>
  );
}
