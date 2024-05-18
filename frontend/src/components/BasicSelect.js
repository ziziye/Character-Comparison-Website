import React from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

function BasicSelect({ onCharacterSelect }) {
  const [characters, setCharacters] = React.useState([]);
  const [selectedCharacter, setSelectedCharacter] = React.useState('');

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3001/api/v1/character/list");
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json();
        setCharacters(data.data);
      } catch (error) {
        console.error("There was a problem fetching the data:", error);
      }
    }

    fetchData();
  }, []);

  const handleChange = (event) => {
    setSelectedCharacter(event.target.value);
    onCharacterSelect(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="character-select-label">Character</InputLabel>
        <Select
          labelId="character-select-label"
          id="character-select"
          value={selectedCharacter}
          label="Character"
          onChange={handleChange}
        >
          {characters.map((char) => (
            <MenuItem key={char.id} value={char.id}>
              {char.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default BasicSelect;
