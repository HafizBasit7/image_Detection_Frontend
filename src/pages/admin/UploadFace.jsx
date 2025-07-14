import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Input, Avatar
} from '@mui/material';
import { useAdminRecordFace } from '../../api/mutation';

const UploadFace = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { mutate, isPending, isSuccess, isError, error } = useAdminRecordFace();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('roll_number', rollNumber);
    formData.append('image', image);
    mutate(formData);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Upload Face Record</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Roll Number"
            fullWidth
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Input
            type="file"
            onChange={handleImageChange}
            inputProps={{ accept: 'image/*' }}
            required
          />
          {preview && (
            <Box mt={2}>
              <Avatar src={preview} sx={{ width: 100, height: 100 }} />
            </Box>
          )}
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isPending}>
            {isPending ? 'Uploading...' : 'Upload'}
          </Button>
          {isSuccess && <Typography color="success.main" mt={2}>Face uploaded!</Typography>}
          {isError && <Typography color="error.main" mt={2}>{error.message}</Typography>}
        </form>
      </Paper>
    </Box>
  );
};

export default UploadFace;
