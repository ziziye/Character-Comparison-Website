import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Stack, Chip } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { styled } from '@mui/material/styles';


const FavoriteCharacters = () => {
  const { user } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user.userId) {
        setError('User ID is not available');
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/user/${user.userId}/getFavorite`);
        
        if (response.data.code === 200 && response.data.favorites) {
          setFavorites(response.data.favorites);  // Assuming the API correctly nests favorites under the 'favorites' key
        } else {
          setError(response.data.msg || 'Failed to fetch data');
        }
      } catch (error) {
        console.error('API Error:', error.response || error.message || error);
        setError('Error fetching favorites: ' + (error.response?.data?.msg || error.message || error.toString()));
      }
    };

    fetchFavorites();
  }, [user.userId]);  // Dependency on user.userId

  if (!user.userId) {
    return (
      <div style={{ width: "100%", height: "200px", overflow: "auto" }}>
      <h2>Favorite Characters</h2>
      <li>Please log in to view favorite characters.</li>
    </div>
    );
  }

  if (error) {
    return (        <div style={{ width: "100%", height: "200px", overflow: "auto" }}>
      <h2>Favorite Characters</h2>
      <li>No favorite characters found.</li>
    </div>);
  }

  if (favorites.length === 0 && !error) {
    return (
      <div style={{ width: "100%", height: "200px", overflow: "auto" }}>
      <h2>Favorite Characters</h2>
      <li>No favorite characters found.</li>
    </div>
    
  );
  }

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  flex: '1 0 18%',  // place 5 items per row
  margin: '8px 4px',
}));

return (
  <div style={{ width: "100%", height: "200px", overflow: "auto" }}>
    <h2>Favorite Characters</h2>
    <Stack
      direction="row"
      sx={{ flexWrap: 'wrap' }}  // line feed
    >
      {favorites.map((character, index) => (
        <Item key={index}>{character.name || character}</Item>
      ))}
    </Stack>
  </div>
);

};

export default FavoriteCharacters;
