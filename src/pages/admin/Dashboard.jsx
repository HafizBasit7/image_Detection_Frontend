import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAdminUsers, useAdminDetections } from '../../api/mutation';

const Dashboard = () => {
  const { data: usersData, isLoading: usersLoading } = useAdminUsers();
  const { data: detData, isLoading: detLoading } = useAdminDetections();

  const usersCount = usersData?.results?.length ?? 0;
  const detCount = detData?.results?.length ?? 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">
              {usersLoading ? 'Loading...' : usersCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Detections</Typography>
            <Typography variant="h4">
              {detLoading ? 'Loading...' : detCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
