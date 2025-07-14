import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, MenuItem, Grid
} from '@mui/material';
import { useAdminCreateUser } from '../../api/mutation';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'general', label: 'General User' },
  { value: 'student', label: 'Student' },
];

const Users = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'general',
    roll_number: '',
  });

  const { mutate, isPending, isSuccess, isError, error } = useAdminCreateUser();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Create New User</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {['username', 'email', 'first_name', 'last_name', 'password'].map(field => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={field.replace('_', ' ').toUpperCase()}
                  name={field}
                  type={field === 'password' ? 'password' : 'text'}
                  fullWidth
                  required
                  value={form[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role"
                name="role"
                select
                fullWidth
                value={form.role}
                onChange={handleChange}
              >
                {roles.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {form.role === 'student' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Roll Number"
                  name="roll_number"
                  fullWidth
                  required
                  value={form.roll_number}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isPending}>
            {isPending ? 'Creating...' : 'Create User'}
          </Button>
          {isSuccess && <Typography color="success.main" mt={2}>User created successfully!</Typography>}
          {isError && <Typography color="error.main" mt={2}>{error.message}</Typography>}
        </form>
      </Paper>
    </Box>
  );
};

export default Users;
