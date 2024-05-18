import { useState, useEffect }from "react";
import FilterTableCompare from "./Homepage/FilterTableCompare";
import VersusBanner from "./Homepage/VersusBanner";
import Grid from "@mui/material/Unstable_Grid2";
import Results from "./Homepage/Results";
import { useUser } from '../contexts/UserContext';
import RecentComparison from "./RecentComparison";




export default function Homepage() {
  const [data, setData] = useState({
    strength: [0, 100],
    speed: [0, 100],
    skill: [0, 100],
    fearFactor: [0, 100],
    power: [0, 100],
    intelligence: [0, 100],
    wealth: [0, 100],
  });
  const [record, setRecord] = useState([]);
  const { user, setRecentComparison } = useUser();
  const [search, setSearch] = useState("");
  const [rawData, setRawData] = useState([]);
  const [tabledata, setTableData] = useState(rawData);
  const [name0, setName0] = useState("Unknown");
  const [name1, setName1] = useState("Unknown");
  const [src0, setSrc0] = useState("");
  const [src1, setSrc1] = useState("");
  const [games, setGames] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [color0, setColor0] = useState("#1f1f1f");
  const [color1, setColor1] = useState("#1f1f1f");
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3001/api/v1/character/list");
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const result = await response.json();
        const arr0 = result.data.map((character, index) => ({
          ...character,
          id: index,
          jguo: false,
        }));
        setRawData(arr0);
        setRecord(user.recentComparison || []);
      } catch (error) {
        console.error("There was a problem fetching the data:", error);
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    let validData = rawData.filter((item) => {
      if (
        item.strength >= data.strength[0] &&
        item.strength <= data.strength[1] &&
        item.speed >= data.speed[0] &&
        item.speed <= data.speed[1] &&
        item.skill >= data.skill[0] &&
        item.skill <= data.skill[1] &&
        item.fear_factor >= data.fearFactor[0] &&
        item.fear_factor <= data.fearFactor[1] &&
        item.power >= data.power[0] &&
        item.power <= data.power[1] &&
        item.intelligence >= data.intelligence[0] &&
        item.intelligence <= data.intelligence[1] &&
        item.wealth >= data.wealth[0] &&
        item.wealth <= data.wealth[1]
      ) {
        if (search === "") {
          return item;
        } else {
          return item.name.toLowerCase().includes(search.toLowerCase());
        }
      }
    });
    const arr1 = validData.map((item, index) => {
      return {
        ...item,
        // jguo: false,
        id: index,
      };
    });
    setTableData(arr1);
  }, [data]);
  useEffect(() => {
    let validData = rawData.filter((item) => {
      if (
        item.strength >= data.strength[0] &&
        item.strength <= data.strength[1] &&
        item.speed >= data.speed[0] &&
        item.speed <= data.speed[1] &&
        item.skill >= data.skill[0] &&
        item.skill <= data.skill[1] &&
        item.fear_factor >= data.fearFactor[0] &&
        item.fear_factor <= data.fearFactor[1] &&
        item.power >= data.power[0] &&
        item.power <= data.power[1] &&
        item.intelligence >= data.intelligence[0] &&
        item.intelligence <= data.intelligence[1] &&
        item.wealth >= data.wealth[0] &&
        item.wealth <= data.wealth[1]
      ) {
        if (search === "") {
          return item;
        } else {
          return item.name.toLowerCase().includes(search.toLowerCase());
        }
      }
    });
    const arr1 = validData.map((item, index) => {
      return {
        ...item,
        // jguo: false,
        id: index,
      };
    });
    setTableData(arr1);
  }, [search]);
  useEffect(() => {
    let size = 0;
    tabledata.forEach((item) => {
      if (item.jguo) {
        size += 1;
      }
    });
    if (size === 0) {
      setName0("Unknown");
      setSrc0("");
      setName1("Unknown");
      setSrc1("");
      setColor0("#1f1f1f");
      setColor1("#1f1f1f");
      setGames([0, 0, 0, 0, 0, 0, 0]);
    } else if (size === 1) {
      const arr0 = tabledata.filter((item) => {
        return item.jguo;
      });
      setName0(arr0[0].name);
      setSrc0("/" + arr0[0].image_url);
      setName1("Unknown");
      setSrc1("");
      setColor0("#1f1f1f");
      setColor1("#1f1f1f");
      setGames([0, 0, 0, 0, 0, 0, 0]);
    } else if (size === 2) {
      const arr0 = tabledata.filter((item) => {
        return item.jguo;
      });
      setName0(arr0[0].name);
      setName1(arr0[1].name);
      setSrc0("/" + arr0[0].image_url);
      setSrc1("/" + arr0[1].image_url);
      let arr1 = [0, 0, 0, 0, 0, 0, 0];
      if (arr0[0].strength > arr0[1].strength) {
        arr1[0] = 1;
      } else if (arr0[0].strength < arr0[1].strength) {
        arr1[0] = 2;
      } else {
        if (Math.random() < 0.5) {
          arr1[0] = 1;
        } else {
          arr1[0] = 2;
        }
      }
      if (arr0[0].speed > arr0[1].speed) {
        arr1[1] = 1;
      } else if (arr0[0].speed < arr0[1].speed) {
        arr1[1] = 2;
      } else {
        if (Math.random() < 0.5) {
          arr1[1] = 1;
        } else {
          arr1[1] = 2;
        }
      }
      if (arr0[0].skill > arr0[1].skill) {
        arr1[2] = 1;
      } else if (arr0[0].skill < arr0[1].skill) {
        arr1[2] = 2;
      } else {
        if (Math.random() < 0.5) {
          arr1[2] = 1;
        } else {
          arr1[2] = 2;
        }
      }
      if (arr0[0].fear_factor > arr0[1].fear_factor) {
        arr1[3] = 1;
      } else if (arr0[0].fear_factor < arr0[1].fear_factor) {
        arr1[3] = 2;
      } else {
        if (Math.random() < 0.5) {
          arr1[3] = 1;
        } else {
          arr1[3] = 2;
        }
      }
      if (arr0[0].power > arr0[1].power) {
        arr1[4] = 1;
      } else if (arr0[0].power < arr0[1].power) {
        arr1[4] = 2;
      } else {
        if (Math.random() < 0.5) {
          arr1[4] = 1;
        } else {
          arr1[4] = 2;
        }
      }
      if (arr0[0].intelligence > arr0[1].intelligence) {
        arr1[5] = 1;
      } else if (arr0[0].intelligence < arr0[1].intelligence) {
        arr1[5] = 2;
      } else {
        if (Math.random() < 0.5) {
          arr1[5] = 1;
        } else {
          arr1[5] = 2;
        }
      }
      if (arr0[0].wealth > arr0[1].wealth) {
        arr1[6] = 1;
      } else if (arr0[0].wealth < arr0[1].wealth) {
        arr1[6] = 2;
      } else {
        if (Math.random() < 0.5) {
          arr1[6] = 1;
        } else {
          arr1[6] = 2;
        }
      }
      console.log(arr1);
      let size_1 = 0;
      let size_2 = 0;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] === 1) {
          size_1 += 1;
        } else if (arr1[i] === 2) {
          size_2 += 1;
        }
      }

      let arr2 = user.recentComparison || [];

      arr2.push({ name0: arr0[0].name, name1: arr0[1].name });
      const arr3 = arr2.map((item, index) => {
        return { ...item, id: index };
      });
      setRecord(arr3);
      setRecentComparison(arr3);


      if (size_1 > size_2) {
        setColor0("#00550c");
        setColor1("#540000");
      } else {
        setColor0("#00550c");
        setColor1("#540000");
      }
      setGames(arr1);
    } else if (size > 2) {
      let i0 = 0;
      let arr0 = [];
      for (let i = 0; i < tabledata.length; i++) {
        if (i0 === 1) {
          arr0.push(tabledata[i]);
        } else {
          if (tabledata[i].jguo) {
            arr0.push({ ...tabledata[i], jguo: false });
            i0 += 1;
          } else {
            arr0.push(tabledata[i]);
          }
        }
      }
      setTableData(arr0);
    }
  }, [tabledata]);
  useEffect(() => {
    setTableData(rawData);
  }, [rawData]);



  return (
    <Grid container>
      <Grid xs={12}>
        <FilterTableCompare
          data={data}
          setData={setData}
          search={search}
          setSearch={setSearch}
          tabledata={tabledata}
          setTableData={setTableData}
          record={record}

        />
      </Grid>
      <Grid xs={12}>
        <VersusBanner name0={name0} src0={src0} name1={name1} src1={src1} />
      </Grid>
      <Grid xs={12}>
        <Results games={games} color0={color0} color1={color1} />
      </Grid>
    </Grid>
  );
}
