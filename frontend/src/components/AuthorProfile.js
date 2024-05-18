import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Paper, Stack, Chip, Button, Modal, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AuthorProfile({ authorName, authorId }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoritesError, setFavoritesError] = useState('');
  const [contributions, setContributions] = useState([]);
  const [contributionsError, setContributionsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (!authorId) {
      setFavoritesError("This user don\'t have any favorite characters");
      setContributionsError("This user has 0 contribution.");
      return;
    }
  
    setIsLoading(true);
  
    // Fetch name and email and favorite characters by authorId
    axios.get(`http://localhost:3001/api/v1/user/getById/${authorId}`)
      .then(response => {
        if (response.data.code === 200 && response.data.user) {
          setUsername(response.data.user.firstname + " " + response.data.user.lastname)
          setEmail(response.data.user.email);
        } else {
          setEmail('No email available');
        }
      })
      .catch(error => {
        console.error('Error fetching email:', error);
        setEmail('No email available');
      });
  
    axios.get(`http://localhost:3001/api/v1/user/${authorId}/getFavorite`)
      .then(response => {
        if (response.data.code === 200 && response.data.favorites) {
          setFavorites(response.data.favorites);
        } else if (response.data.code === 404) {
          setFavoritesError(response.data.msg);
          setFavorites([]);
        } else {

        }
      })
      .catch(error => {
        console.error('This user don\'t favorite characters.', error);
        setFavoritesError('This user don\'t favorite characters.');
      });
  
    // Fetch contributions by authorId
    axios.get(`http://localhost:3001/api/v1/contribution/${authorId}/findByUserId`)
      .then(response => {
        if (response.data && response.data.code === 200) {
          setContributions(response.data.data.map((contrib, index) => ({
            id: index + 1,
            action: contrib.action,
            status: contrib.status,
            date: new Date(contrib.date).toLocaleString(),
            data: contrib.data,
            dataId: contrib.data.id,  
            dataName: contrib.data.name  
          })));
        } else if (response.data.code === 404) {
          setContributionsError(response.data.msg);
        } else {
        }
      })
      .catch(error => {
        console.error('No contributions found.');
        setContributionsError('No contributions found.');
      })
      .finally(() => setIsLoading(false));
  }, [authorId]);
  


  const columns = [
    { field: 'id', headerName: ' ', width: 90 },
    { field: 'dataId', headerName: 'Data ID', width: 100 },
    { field: 'dataName', headerName: 'Character Name', width: 150 },
    { field: 'action', headerName: 'Action', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'date', headerName: 'Date', width: 160 },
    {
      field: 'data',
      headerName: 'Data',
      width: 180,
      renderCell: (params) => <BasicModal data={params.row.data} />,
    },
  ];

  function BasicModal({ data }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <div>
        <Button onClick={handleOpen}>View Details</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Detailed Information
            </Typography>
            {Object.entries(data).map(([key, value], index) => (
              <Typography key={index} sx={{ mt: 2 }}>
                <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
              </Typography>
            ))}
          </Box>
        </Modal>
      </div>
    );
  }


  return (
    <>
      <div className="page-container">
        <div className="centered-container">
          <Box className="icon-container">
            <Avatar alt={authorName} src="" sx={{ width: 150, height: 150, marginTop: 15, marginBottom: -5, border: '5px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}/>
          </Box>
        </div>
        <Typography variant="h4" gutterBottom sx={{ marginTop: 6, textAlign: 'center'}}>
          {authorName|| username || 'Unknown'}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'center'}}>
          Email: {email || 'No email available'}  
        </Typography>
        <Divider variant="middle" component="li" />
      <Typography variant="h5" sx={{ mt: 2, fontFamily: 'Times New Roman' }} component="li">Favorite Characters</Typography>
          {favoritesError ? (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
              {favoritesError}
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 2 }}>
              {favorites.map((character, index) => (
                <Chip key={index} label={character.name || character} />
              ))}
            </Stack>
          )}
        <Divider variant="middle" component="li" />
      <Typography variant="h5" gutterBottom sx={{ mt: 2, fontFamily: 'Times New Roman' }} component="li">
        Contributions
      </Typography>
      <Divider variant="middle" component="li" />
      {contributionsError ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', margin:10, textAlign:"center" }}>
          {contributionsError}
        </Typography>
      ) : (
        <DataGrid
          rows={contributions}
          columns={columns}
          pageSize={5}
          autoHeight
          loading={isLoading}
          sx={{ width: '100%', height: 400, mb: 2 }}
        />
      )}
      </div>
    </>
  );
}
