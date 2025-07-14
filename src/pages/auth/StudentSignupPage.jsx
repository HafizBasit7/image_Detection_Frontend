import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import { useStudentSignupMutation } from '../../api/mutation';

const StudentSignupPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useStudentSignupMutation();

  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    roll_number: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" mb={3}>
        Student Signup
      </Typography>

      {isError && (
        <Alert severity="error">{error.response?.data?.message || 'Signup failed'}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="First Name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Roll Number"
            name="roll_number"
            value={form.roll_number}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
          >
            {isPending ? 'Signing up...' : 'Signup'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default StudentSignupPage;
