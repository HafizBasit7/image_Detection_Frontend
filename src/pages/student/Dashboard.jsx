import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const StudentDashboard = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Student Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1">
          Welcome! You can manage your face record and view detection reports.
        </Typography>
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
