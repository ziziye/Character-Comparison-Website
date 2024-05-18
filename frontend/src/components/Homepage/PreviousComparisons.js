import { Grid, Box } from "@mui/material";

export default function PreviousComparisons({ record, tabledata, setTableData }) {
  const fun0 = (name0, name1) => {
    let arr0 = tabledata.map((item) => ({ ...item, jguo: false }));
    for (let i = 0; i < arr0.length; i++) {
      if (arr0[i].name === name0 || arr0[i].name === name1) {
        arr0[i].jguo = true;
      }
    }
    setTableData(arr0);
  };
  const listItems = record.map((record) => (
    <div
      style={{
        marginTop: "12px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "1fr",
        gridColumnGap: "16px",
        gridRowGap: "0px",
        cursor: "pointer",
      }}
      key={record.id}
    >
      <div
        style={{ gridArea: "1 / 1 / 2 / 2" }}
        onClick={() => fun0(record.name0, record.name1)}
      >
        {record.name0}
      </div>
      <div
        style={{ gridArea: "1 / 2 / 2 / 3" }}
        onClick={() => fun0(record.name0, record.name1)}
      >
        {record.name1}
      </div>
    </div>
  ));
  return (
    <Grid container border={1} pl={2} pr={2} pb={2}>
      <Grid item xs={12} mt={2}>
        <Box fontSize={20} fontFamily={"Times New Roman"} fontWeight={"2px"}>Previous-comparisons</Box>
        <div style={{ width: "100%", height: "340px", overflow: "auto",fontFamily:"Times New Roman" }}>
          {listItems}
        </div>
      </Grid>
    </Grid>
  );
}
