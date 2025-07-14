// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/mutation';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const { mutate, isPending, isError, error } = useLoginMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: (data) => {
        // Store token and role
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('username', data.user.username);

        // Redirect to respective dashboard
        navigate(`/${data.user.role}`, { replace: true });
      },
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.response?.data?.message || 'Login failed. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Box mt={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isPending}
              startIcon={isPending && <CircularProgress size={18} />}
            >
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
