import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

// Custom styled container component for positioning login information and buttons to top right corner
const UserInfoContainer = styled('div')({
  position: 'absolute',
  right: 10,
  top: 10,
  textAlign: 'center' 
});

function TopBar({ user, onLogout }) {
  return (
    <header className="top-bar">
      <h1>Cartoonopia</h1>
      <p>The home of characters and cartoons!</p>
      {user && (
        <UserInfoContainer>
          {/* Display different welcome messages depending on whether the user is an administrator or not */}
          <p style={{ fontSize: '20px', fontFamily: 'Georgia', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
            Welcome {user.isAdmin ? 'Administrator' : 'User'}
          </p>
          {/* Usernames are displayed on the next line, centred and aligned */}
          <p style={{ fontSize: '15px', fontFamily: 'Open Sans', color: 'white', marginTop: '0' }}>
            {user.username}
          </p>
          {/* Use the MUI Button component and adjust the style to add spacing above */}
          <Button onClick={onLogout} variant="contained" size="small" sx={{ bgcolor: '#424242', '&:hover': { bgcolor: '#616161' },  marginTop: '15px' }}>
            Log out
          </Button>
        </UserInfoContainer>
      )}
    </header>
  );
}

export default TopBar;
