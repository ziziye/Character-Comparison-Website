import * as React from 'react';
import { useUser } from '../contexts/UserContext';
import Avatar from '@mui/material/Avatar';
import { Box, Typography } from '@mui/material';


export default function PersonalInfo() {
    const { user } = useUser();
    return (
        <>
            <div className="centered-container">
            <Box className="icon-container">
                <Avatar alt={user.username} src="" sx={{ width: 150, height: 150, marginTop:15, marginBottom:-5, border: '5px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}/>
            </Box>

            </div>
            <Typography variant="h3" gutterBottom sx={{marginTop:6}}> {user.username}</Typography>
            <Typography variant="p" gutterBottom>email:  {user.email}</Typography>
        </>
    );
}
