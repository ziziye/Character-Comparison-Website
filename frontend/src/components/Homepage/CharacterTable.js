import { Grid } from "@mui/material";
const CharacterTable = ({ data, setTableData }) => {
  const fun0 = (index) => {
    setTableData(
      data.map((item) => {
        if (item.id === index) {
          return { ...item, jguo: !item.jguo };
        }
        return item;
      })
    );
  };

  const headers = (
    <Grid container style={{ height: "20px", fontWeight: "bold", marginBottom:"10px", fontFamily:"Times New Roman"}}>
      <Grid item xs={2.7} style={{ height: "26px", lineHeight: "26px" }}>Name</Grid>
      <Grid item xs={1.15}>Strength</Grid>
      <Grid item xs={1}>Speed</Grid>
      <Grid item xs={1}>Skill</Grid>
      <Grid item xs={1.5}>Fear Factor</Grid>
      <Grid item xs={1}>Power</Grid>
      <Grid item xs={1.5}>Intelligence</Grid>
      <Grid item xs={1}>Wealth</Grid>
      <Grid item xs={1}>Select</Grid>
    </Grid>
  );

  const table = (data || []).map((item) => ( // defensive check
    <Grid container key={item.id} style={{ height: "26px", fontFamily:"Times New Roman"}}>
      <Grid item xs={3} style={{ height: "26px", lineHeight: "26px" }}>
        {item.name}
      </Grid>
      <Grid item xs={1}>
        {item.strength}
      </Grid>
      <Grid item xs={1.1}>
        {item.speed}
      </Grid>
      <Grid item xs={1.1}>
        {item.skill}
      </Grid>
      <Grid item xs={1.3}>
        {item.fear_factor}
      </Grid>
      <Grid item xs={1.1}>
        {item.power}
      </Grid>
      <Grid item xs={1.4}>
        {item.intelligence}
      </Grid>
      <Grid item xs={1}>
        {item.wealth}
      </Grid>
      <Grid item xs={1}>
        <input
          type="checkbox"
          style={{ cursor: "pointer" }}
          checked={item.jguo}
          onChange={() => fun0(item.id)}
        />
      </Grid>
    </Grid>
  ));

  return (<div style={{ marginTop: "16px", width: "100%", height: "340px", overflow: "auto" }} >
    {headers}
    {table}
  </div>);
};

export default CharacterTable;
