// src/pages/auth/LandingPage.jsx

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Detection Portal
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Choose your role to proceed:
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{ mr: 2 }}
        >
          Admin / General Login
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/signup')}
        >
          Student Signup
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
