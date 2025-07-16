import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/mutation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useLoginMutation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) navigate(`/${role}`, { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('username', data.user.username);
        navigate(`/${data.user.role}`, { replace: true });
      },
    });
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left Panel */}
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          background: 'linear-gradient(to bottom right, #00d2ff, #3a7bd5)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 6,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            <span style={{ color: '#FFD700' }}>▶</span> volusion
          </Typography>
          <Typography variant="h6" fontWeight={500}>
            Fast, Efficient and Productive
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, maxWidth: 400 }}>
            In this kind of post, the blogger introduces a person they’ve interviewed and provides background information about their work.
          </Typography>
        </Box>
      </Grid>

      {/* Right Panel - Login Form */}
      <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" fontWeight={600}>
            Sign In
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Hey there, please sign in to continue
          </Typography>

          {isError && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error?.response?.data?.message || 'Login failed. Please try again.'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember Me"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.5 }}
              disabled={isPending}
              startIcon={isPending && <CircularProgress size={20} />}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant="body2">
                  Don’t have an account?{' '}
                  <Link component="button" onClick={() => navigate('/signup')} underline="hover">
                    Sign Up
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
