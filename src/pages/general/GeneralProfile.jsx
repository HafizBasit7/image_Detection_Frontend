// 4. UserProfile.jsx (basic placeholder)
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const GeneralProfile = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Profile</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Your profile information will appear here.</Typography>
      </Paper>
    </Box>
  );
};

export default GeneralProfile;
