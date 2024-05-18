import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useUser } from '../contexts/UserContext'; // This is the Context where user information is stored
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AuthorProfile from './AuthorProfile';


const UserManagement = () => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25  // The default number of lines per page is 25.
  });

  const { user } = useUser(); // Get information about the currently logged in user

  //to handle the dialog
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenUserProfile = (userId) => {
    setSelectedUserId(userId);
    setOpen(true);
  };

  const handleCloseUserProfile = () => {
    setOpen(false);
  };


  const handleRoleChange = async (userId, action) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:3001/api/v1/user/${userId}/${action}`);
      if (response.status === 200) {
        // Update local rows to reflect role changes
        setRows(rows.map(row => {
          if (row.id === userId) {
            return { ...row, role: action === 'promote' ? 'Admin' : 'User' };
          }
          return row;
        }));
      } else {
        console.error('Failed to change role:', response.status, response.data.msg);
      }
    } catch (error) {
      console.error('Error changing role:', error);
    }
    setIsLoading(false);
  };

  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 140},
    { field: 'lastName', headerName: 'Last Name', width: 140 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 90 },
    {
      field: 'userProfile',
      headerName: 'UserProfile',
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <Button
        // color="secondary"
        onClick={() => handleOpenUserProfile(params.row.id)}
      >
        View Profile
      </Button>
      ),
    },    
    {
      field: 'manageRole',
      headerName: 'Role Management',
      renderCell: (params) => {
        const isSelf = params.row.id === user.userId; // Check if you are the current user
        return (
          <>
            {params.row.role === 'Admin' && !isSelf && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleRoleChange(params.row.id, 'demote')}
              >
                Demote
              </Button>
            )}
            {params.row.role === 'User' && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleRoleChange(params.row.id, 'promote')}
              >
                Promote
              </Button>
            )}
          </>
        );
      },
      width: 150,
      sortable: false,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3001/api/v1/user/list?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      if (response.status === 200) {
        const adaptedRows = response.data.data.map(user => ({
          id: user._id,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          role: user.role 
        }));
        setRows(adaptedRows);
        setTotalRows(response.data.total);
      } else {
        console.error('Failed to fetch data:', response.status, response.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [paginationModel]);

  return (
    <div className="page-container">
      <div style={{ width: '100%', backgroundColor: 'white' }}>
        <h1 className="text-2xl font-bold p-5">User Management</h1>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSize={paginationModel.pageSize}  // Set the initial page size
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          paginationMode="server"
          rowCount={totalRows}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
      <Dialog open={open} onClose={handleCloseUserProfile} maxWidth="lg" fullWidth>
      <DialogTitle>User Profile</DialogTitle>
      <DialogContent>
        {selectedUserId && <AuthorProfile authorId={selectedUserId} />}
      </DialogContent>
    </Dialog>

    </div>
  );
};

export default UserManagement;
