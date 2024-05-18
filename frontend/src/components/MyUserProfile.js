import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';
import PersonalInfo from './PersonalInfo';
import FavoriteCharacters from './FavoriteCharacters';
import RecentComparison from './RecentComparison';
import UserContributions from './UserContributions';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
}));

export default function MyUserProfile() {
  const router = useRouter();
  const { username } = router.query;  

  return (
    <div className="page-container userprofile">
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Item><PersonalInfo username={username} /></Item>
        </Grid>
        <Grid xs={6}>
          <Item><FavoriteCharacters username={username}/></Item>
        </Grid>
        <Grid xs={6}>
          <Item><RecentComparison username={username} /></Item>
        </Grid>
        <Grid xs={12}>
          <Item><UserContributions userId={useUser.userId} /></Item>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}
