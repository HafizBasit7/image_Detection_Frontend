import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  CssBaseline,
  Avatar,
  Grid,
  Link
} from '@mui/material';
import { useStudentSignupMutation } from '../../api/mutation';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const StudentSignupPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useStudentSignupMutation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/login');
    }
  }, [navigate]);

  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    roll_number: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    mutate(form, {
      onSuccess: () => {
        navigate('/login');
      },
      onError: (error) => {
        if (error?.error) {
          setFormErrors(error.error);
        }
      },
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Student Registration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Please fill in your details to create a student account.
          </Typography>

          {formErrors?.non_field_errors && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {formErrors.non_field_errors[0]}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={form.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username?.[0]}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              autoComplete="given-name"
              value={form.first_name}
              onChange={handleChange}
              error={!!formErrors.first_name}
              helperText={formErrors.first_name?.[0]}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="family-name"
              value={form.last_name}
              onChange={handleChange}
              error={!!formErrors.last_name}
              helperText={formErrors.last_name?.[0]}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="roll_number"
              label="Roll Number"
              name="roll_number"
              value={form.roll_number}
              onChange={handleChange}
              error={!!formErrors.roll_number}
              helperText={formErrors.roll_number?.[0]}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password?.[0]}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isPending}
            >
              {isPending ? 'Signing up...' : 'Sign Up'}
            </Button>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link 
                  href="#" 
                  variant="body2" 
                  onClick={() => navigate('/login')}
                  underline="hover"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default StudentSignupPage;