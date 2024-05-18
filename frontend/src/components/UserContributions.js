import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

function fetchContributions(setContributions, setError, setIsLoading, userId) {
  setIsLoading(true);
  const endpoint = `http://localhost:3001/api/v1/contribution/${userId}/findByUserId`;
  axios.get(endpoint).then(response => {
    setIsLoading(false);
    if (response.data && response.data.code === 200) {
      setContributions(response.data.data.map((contrib, index) => ({
        id: index + 1,  // Using index as ID for display
        action: contrib.action,
        characterName: contrib.data.name || contrib.data.id,
        status: contrib.status,
        date: new Date(contrib.date).toLocaleString(),
        data: contrib.data, 
        contributionId: contrib.contribution_id,
      })));
    } else {
      setError('No contributions found.');
    }
  }).catch(error => {
    setIsLoading(false);
    if (error.response && error.response.status === 404) {
      setError('This user has 0 contribution.');
    } else {
      console.error('Error fetching data:', error);
      setError('Error fetching contributions: ' + error.message);
    }
  });
}

export default function UserContributions() {
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user.userId) {
      fetchContributions(setContributions, setError, setIsLoading, user.userId);
    } else {
      setError('User ID is not available, please sign in.');
      setIsLoading(false);
    }
  }, [user.userId]);

  const revokeUserContribution = (contributionId) => {
    setIsLoading(true);
    axios.post(`http://localhost:3001/api/v1/contribution/${contributionId}/reject`, {
      withCredentials: true
    })
    .then(response => {
      setIsLoading(false);
      if (response.data.code === 200) {
        alert('Success to revoke contribution.');
        fetchContributions(setContributions, setError, setIsLoading, user.userId);
      } else {
        alert('Failed to revoke contribution.');
      }
    })
    .catch(error => {
      console.error('Error revoking contribution:', error);
      alert('Error revoking contribution: ' + (error.message || JSON.stringify(error)));
      setIsLoading(false);
    });
    
  };

  const columns = [
    { field: 'id', headerName: ' ', width: 40 },
    { field: 'action', headerName: 'Action', width: 130 },
    { field: 'characterName' , headerName: 'Character name', width: 130 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'date', headerName: 'Date', width: 170 },
    {
      field: 'data',
      headerName: 'Data',
      width: 170,
      renderCell: (params) => <BasicModal data={params.row.data} />,
    },
    {
      field: 'revoke',
      headerName: 'Revoke',
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => revokeUserContribution(params.row.contributionId)}
          disabled={params.row.status !== "Pending"}
        >
          Revoke
        </Button>
      ),
      sortable: false,
      width: 150
    },
  ];


  if (error) {
    return (
      <div style={{ marginTop: "16px", width: "100%", height: "600px", overflow: "auto" }}>
        <h2>Contributions</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px", width: "100%", height: "600px", overflow: "auto" }}>
      <h2>Contributions</h2>
      <DataGrid
        autoHeight
        rows={contributions}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        loading={isLoading}
      />
    </div>
  );
}
