import { Typography } from "@mui/material";
export default function Results({ games, color0, color1 }) {
  const style0 = {
    padding: "15px 0px",
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <div
      style={{
        margin: "50px auto 30px auto",
        width: "45%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(7, 1fr)",
        gridColumnGap: "16px",
        gridRowGap: "0px",
        backgroundColor: "#1f1f1f",
      }}
    >
      <div
        style={{
          ...style0,
          gridArea: "1 / 1 / 2 / 2",
          backgroundColor: color0,
        }}
      >
        {games[0] == 1 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "2 / 1 / 3 / 2",
          backgroundColor: color0,
        }}
      >
        {games[1] == 1 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "3 / 1 / 4 / 2",
          backgroundColor: color0,
        }}
      >
        {games[2] == 1 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "4 / 1 / 5 / 2",
          backgroundColor: color0,
        }}
      >
        {games[3] == 1 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "5 / 1 / 6 / 2",
          backgroundColor: color0,
        }}
      >
        {games[4] == 1 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "6 / 1 / 7 / 2",
          backgroundColor: color0,
        }}
      >
        {games[5] == 1 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "7 / 1 / 8 / 2",
          backgroundColor: color0,
        }}
      >
        {games[6] == 1 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div style={{ ...style0, gridArea: "1 / 2 / 2 / 3" }}>
        <Typography variant="h5" color={"white"}>
          STRENGTH
        </Typography>
      </div>
      <div style={{ ...style0, gridArea: "2 / 2 / 3 / 3" }}>
        <Typography variant="h5" color={"white"}>
          SPEED
        </Typography>
      </div>
      <div style={{ ...style0, gridArea: "3 / 2 / 4 / 3" }}>
        <Typography variant="h5" color={"white"}>
          SKILL
        </Typography>
      </div>
      <div style={{ ...style0, gridArea: "4 / 2 / 5 / 3" }}>
        <Typography variant="h5" color={"white"}>
          FEAR FACTOR
        </Typography>
      </div>
      <div style={{ ...style0, gridArea: "5 / 2 / 6 / 3" }}>
        <Typography variant="h5" color={"white"}>
          POWER
        </Typography>
      </div>
      <div style={{ ...style0, gridArea: "6 / 2 / 7 / 3" }}>
        <Typography variant="h5" color={"white"}>
          INTELLIGENCE
        </Typography>
      </div>
      <div style={{ ...style0, gridArea: "7 / 2 / 8 / 3" }}>
        <Typography variant="h5" color={"white"}>
          WEALTH
        </Typography>
      </div>
      <div
        style={{
          ...style0,
          gridArea: "1 / 3 / 2 / 4",
          backgroundColor: color1,
        }}
      >
        {games[0] == 2 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "2 / 3 / 3 / 4",
          backgroundColor: color1,
        }}
      >
        {games[1] == 2 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "3 / 3 / 4 / 4",
          backgroundColor: color1,
        }}
      >
        {games[2] == 2 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "4 / 3 / 5 / 4",
          backgroundColor: color1,
        }}
      >
        {games[3] == 2 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "5 / 3 / 6 / 4",
          backgroundColor: color1,
        }}
      >
        {games[4] == 2 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "6 / 3 / 7 / 4",
          backgroundColor: color1,
        }}
      >
        {games[5] == 2 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          ...style0,
          gridArea: "7 / 3 / 8 / 4",
          backgroundColor: color1,
        }}
      >
        {games[6] == 2 ? (
          <Typography variant="h5" color={"white"}>
            ✓
          </Typography>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
