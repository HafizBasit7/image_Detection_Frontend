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
  Link,
  Paper
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
      onSuccess: () => navigate('/login'),
      onError: (error) => {
        if (error?.error) {
          setFormErrors(error.error);
        }
      },
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Paper elevation={4} sx={{ display: 'flex', minHeight: '80vh', overflow: 'hidden' }}>
          {/* Left section with branding */}
          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(to bottom right, #4f46e5, #3b82f6)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Welcome Student!
            </Typography>
            <Typography variant="h6" textAlign="center" maxWidth="80%">
              Register now to access the recognition system. It's fast, secure, and student-focused.
            </Typography>
          </Box>

          {/* Right section with form */}
          <Box
            sx={{
              flex: 1,
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <PersonAddOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Student Registration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Fill out the form to create your account.
              </Typography>
            </Box>

            {formErrors?.non_field_errors && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {formErrors.non_field_errors[0]}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    error={!!formErrors.first_name}
                    helperText={formErrors.first_name?.[0]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    error={!!formErrors.last_name}
                    helperText={formErrors.last_name?.[0]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username?.[0]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Roll Number"
                    name="roll_number"
                    value={form.roll_number}
                    onChange={handleChange}
                    error={!!formErrors.roll_number}
                    helperText={formErrors.roll_number?.[0]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password?.[0]}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, py: 1.5 }}
                disabled={isPending}
              >
                {isPending ? 'Signing up...' : 'Sign Up'}
              </Button>

              <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Grid item>
                  <Link
                    component="button"
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
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default StudentSignupPage;
