import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Modal, Paper } from '@mui/material';
import BasicSelect from '../components/BasicSelect';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  overflowY: 'auto',
};

function BasicModal({ data }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderDetails = (data) => {
    return Object.entries(data).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <Box key={key} sx={{ mt: 1 }}>
            <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
              {key}:
            </Typography>
            {Object.entries(value).map(([subKey, subValue]) => (
              <Typography key={subKey} sx={{ mt: 1 }}>
                <strong>{subKey}:</strong> {subValue}
              </Typography>
            ))}
          </Box>
        );
      } else {
        return (
          <Typography key={key} sx={{ mt: 1 }}>
            <strong>{key}:</strong> {value}
          </Typography>
        );
      }
    });
  };

  return (
    <div>
      <Button onClick={handleOpen}>View Details</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Detailed Information
          </Typography>
          {renderDetails(data)}
        </Paper>
      </Modal>
    </div>
  );
}

function ChangeHistory() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  });

  useEffect(() => {
    if (selectedCharacterId) {
      fetchData();
    }
  }, [selectedCharacterId, paginationModel]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/contribution/${selectedCharacterId}/findByCharacterId?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      if (response.data && response.data.code === 200) {
        setRows(response.data.data.map(item => ({
          id: item._id,
          action: item.action,
          status: item.status,
          date: new Date(item.date).toLocaleString(),
          data: item.data,
          creator: item.creator ? item.creator : "Unknown",
          reviewer: item.reviewer ? item.reviewer : "Unknown"
        })));
      } else {
        setError('No contributions found for this character');
      }
    } catch (error) {
      setError('Error fetching contributions: ' + error.message);
    }
    setIsLoading(false);
  };

  const columns = [
    { field: 'action', headerName: 'Action', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'creator', headerName: 'Creator', width: 150 },
    { field: 'reviewer', headerName: 'Reviewer', width: 150 },
    { field: 'date', headerName: 'Date', width: 190 },
    {
      field: 'data',
      headerName: 'Data',
      width: 190,
      renderCell: (params) => <BasicModal data={params.row.data} />,
    },
  ];

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  return (
    <div className="page-container" style={{ width: '100%', backgroundColor: 'white' }}>
      <h1 className="text-2xl font-bold p-5">Change History</h1>
      <BasicSelect onCharacterSelect={setSelectedCharacterId} />
      <div style={{ marginTop: '20px' }}> 
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={paginationModel.pageSize}
          pageSizeOptions={[5, 10, 20]}
          loading={isLoading}
          paginationModel={paginationModel}
          paginationMode="server"
          rowCount={rows.length}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        />
      </div>
    </div>
  );
}

export default ChangeHistory;
