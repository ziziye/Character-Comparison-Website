import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Modal, Paper, Divider } from '@mui/material';

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
    return Object.entries(data).map(([key, value], index, array) => {
      return (
        <Box key={key} sx={{ mt: 1 }}>
          <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
            <strong>{key}:</strong> {typeof value === 'object' && value !== null ? null : value}
          </Typography>
          {typeof value === 'object' && value !== null &&
            Object.entries(value).map(([subKey, subValue]) => (
              <Typography key={subKey} sx={{ mt: 1, ml: 2 }}>
                <strong>{subKey}:</strong> {subValue}
              </Typography>
            ))
          }
          {index < array.length - 1 && <Divider />}
        </Box>
      );
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

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25  // Set the initial number of lines per page to 25
  });

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await axios.get(`http://localhost:3001/api/v1/contribution/list?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
    if (response.status === 200) {
      const adaptedRows = response.data.data
        .map(item => ({
          id: item._id,
          action: item.action,
          status: item.status,
          contribution_id: item.contribution_id,
          creator: item.creator,
          reviewer: item.reviewer,
          date: new Date(item.date).toLocaleString(),  // Convert string date to Date object
          data: item.data
        }))
        .sort((a, b) => {
          if (a.status === 'Pending' && b.status !== 'Pending') return -1;
          if (a.status !== 'Pending' && b.status === 'Pending') return 1;
          return b.date - a.date; // Sort non-pending items by date
        });
      setRows(adaptedRows);
      setTotalRows(response.data.total);
    } else {
      console.error('获取数据失败:', response.status, response.data);
    }
    setIsLoading(false);
  };

  const handleApprove = async (contributionId) => {
    setIsLoading(true);
    await axios.post(`http://localhost:3001/api/v1/contribution/${contributionId}/approve`);
    fetchData();
  };

  const handleReject = async (contributionId) => {
    setIsLoading(true);
    await axios.post(`http://localhost:3001/api/v1/contribution/${contributionId}/reject`);
    fetchData();
  };

  const columns = [
    { field: 'action', headerName: 'Action', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'creator', headerName: 'Creator', width: 130 },
    { field: 'reviewer', headerName: 'Reviewer', width: 120 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'data',
      headerName: 'Data',
      width: 180,
      renderCell: (params) => <BasicModal data={params.row} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          {params.row.status === 'Pending' ? (
            <>
              <Button variant="contained" color="success" size="small" onClick={() => handleApprove(params.row.contribution_id)}>
                Approve
              </Button>
              <Button variant="contained" color="error" size="small" onClick={() => handleReject(params.row.contribution_id)} style={{ marginLeft: 8 }}>
                Reject
              </Button>
            </>
          ) : (
            <Typography color="text.secondary" sx={{ ml: 1 }}>
              Processing Completed
            </Typography>
          )}
        </>
      ),
      width: 250,
      sortable: false,
    },
  ];

  return (
    <div className="page-container approvalHub">
      <div style={{ width: '100%', backgroundColor: 'white' }}>
        <h1 className="text-2xl font-bold p-5">Approval Hub</h1>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSize={paginationModel.pageSize}  // Use the pageSize in the state
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          paginationMode="server"
          rowCount={totalRows}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        />
      </div>
      <style jsx>{`
      .approvalHub{
        max-width: 1120px;
      }
      `
    }</style>
    </div>

  );
};

export default Dashboard;
