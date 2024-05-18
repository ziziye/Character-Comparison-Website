import { useState } from "react";
import { Slider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
export default function FiltersGroup({ label, data, setData }) {
  const [value, setValue] = useState([0, 100]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (label) {
      case "Strength":
        setData({ ...data, strength: newValue });
        break;
      case "Speed":
        setData({ ...data, speed: newValue });
        break;
      case "Skill":
        setData({ ...data, skill: newValue });
        break;
      case "Fear Factor":
        setData({ ...data, fearFactor: newValue });
        break;
      case "Power":
        setData({ ...data, power: newValue });
        break;
      case "Intelligence":
        setData({ ...data, intelligence: newValue });
        break;
      case "Wealth":
        setData({ ...data, wealth: newValue });
        break;

      default:
        break;
    }
  };
  const valuetext = (value) => {
    return `${value}`;
  };
  return (
    <Grid container>
      <Grid xs={5} fontFamily={"Times New Roman"}>
        <item>{label}</item>
      </Grid>
      <Grid xs={7}>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          color="#1f1f1f"
          size="small"
        />
      </Grid>
    </Grid>
  );
}
