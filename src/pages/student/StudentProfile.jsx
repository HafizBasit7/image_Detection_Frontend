import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useUserProfile } from '../../api/mutation';

const StudentProfile = () => {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>My Profile</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography><strong>Username:</strong> {profile.username}</Typography>
        <Typography><strong>Email:</strong> {profile.email}</Typography>
        <Typography><strong>Role:</strong> {profile.role}</Typography>
      </Paper>
    </Box>
  );
};

export default StudentProfile;
