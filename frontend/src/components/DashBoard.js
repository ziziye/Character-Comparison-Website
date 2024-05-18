import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3001/api/v1/contribution/list?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      if (response.status === 200) {
        const adaptedRows = response.data.data.map(item => ({
          id: item._id,
          user_id: item.user_id._id,
          action: item.action,
          status: item.status,
          contribution_id: item.contribution_id
        }));
        setRows(adaptedRows);
      } else {
        console.error('Failed to fetch data:', response.status, response.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [paginationModel]);

  const handleApprove = async (id) => {
    setIsLoading(true);
    const response = await axios.post(`http://localhost:3001/api/v1/contribution/update`, {
      id,
      status: 'Approved'
    });
    if (response.status === 200) {
      setRows(rows.map(row => row.id === id ? { ...row, status: 'Approved' } : row));
    } else {
      console.error('Failed to approve:', response.status, response.data);
    }
    setIsLoading(false);
  };

  const handleReject = async (id) => {
    setIsLoading(true);
    const response = await axios.post(`http://localhost:3001/api/v1/contribution/update`, {
      id,
      status: 'Rejected'
    });
    if (response.status === 200) {
      setRows(rows.map(row => row.id === id ? { ...row, status: 'Rejected' } : row));
    } else {
      console.error('Failed to reject:', response.status, response.data);
    }
    setIsLoading(false);
  };

  const columns = [
    { field: 'user_id', headerName: 'User ID', width: 200, flex: 1 },
    { field: 'action', headerName: 'Action', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        params.row.status === 'Pending' ? (
          <>
            <Button variant="contained" color="success" size="small" onClick={() => handleApprove(params.id)}>
              Approve
            </Button>
            <Button variant="contained" color="error" size="small" onClick={() => handleReject(params.id)} style={{ marginLeft: 8 }}>
              Reject
            </Button>
          </>
        ) : null
      ),
      width: 250,
      sortable: false,
    },
  ];

  return (
    <div style={{ width: '100%', backgroundColor: 'white' }}>
      <h1 className="text-2xl font-bold p-5">Dashboard</h1>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        rowCount={rows.length}
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
};

export default Dashboard;

