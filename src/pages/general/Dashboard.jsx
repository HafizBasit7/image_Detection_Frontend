import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const GeneralDashboard = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        General User Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1">
          Welcome! You can upload videos, view detection results, and manage your submissions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default GeneralDashboard;
