import { Box, Grid } from "@mui/material";
import SearchBar from "./SearchBar";
import CharacterTable from "./CharacterTable";
import PreviousComparisons from "./PreviousComparisons";
import FiltersGroup from "./FiltersGroup";
export default function FilterTableCompare({
  data,
  setData,
  search,
  setSearch,
  tabledata,
  setTableData,
  record,
}) {
  return (
    <Grid container p={2}>
      <Grid item xs={2.5}>
        <Grid container border={1} pl={2} pr={5} pb={2} sx={{ ml: 1 , mb: 2, mr:2}}>
          <Grid item xs={12} mt={1}>
            <Box fontSize={20} fontFamily={"Times New Roman"}>Filters</Box>
          </Grid>
          <Grid item xs={12} mt={1}>
            <FiltersGroup label={"Strength"} data={data} setData={setData} />
          </Grid>
          <Grid item xs={12} mt={1}>
            <FiltersGroup label={"Speed"} data={data} setData={setData} />
          </Grid>
          <Grid item xs={12} mt={1}>
            <FiltersGroup label={"Skill"} data={data} setData={setData} />
          </Grid>
          <Grid item xs={12} mt={1}>
            <FiltersGroup label={"Fear Factor"} data={data} setData={setData} />
          </Grid>
          <Grid item xs={12} mt={1}>
            <FiltersGroup label={"Power"} data={data} setData={setData} />
          </Grid>
          <Grid item xs={12} mt={1}>
            <FiltersGroup
              label={"Intelligence"}
              data={data}
              setData={setData}
            />
          </Grid>
          <Grid item xs={12} mt={2}>
            <FiltersGroup label={"Wealth"} data={data} setData={setData} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={7} pl={4} pr={4}>
        <SearchBar search={search} setSearch={setSearch} />
        <CharacterTable data={tabledata} setTableData={setTableData} />
      </Grid>
      <Grid item xs={2.5}>
        <PreviousComparisons record={record} tabledata={tabledata} setTableData={setTableData} />
      </Grid>
    </Grid>
  );
}
