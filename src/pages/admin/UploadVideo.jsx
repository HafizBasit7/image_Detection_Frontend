import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Input
} from '@mui/material';
import { useAdminVideoUpload } from '../../api/mutation';

const UploadVideo = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [video, setVideo] = useState(null);

  const { mutate, isPending, isSuccess, isError, error } = useAdminVideoUpload();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('roll_number', rollNumber);
    formData.append('video', video);
    mutate(formData);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Upload Video</Typography>
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
            inputProps={{ accept: '.mp4,.avi,.mov,.mkv,.wmv' }}
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isPending}>
            {isPending ? 'Uploading...' : 'Upload'}
          </Button>
          {isSuccess && <Typography color="success.main" mt={2}>Uploaded successfully!</Typography>}
          {isError && <Typography color="error.main" mt={2}>{error.message}</Typography>}
        </form>
      </Paper>
    </Box>
  );
};

export default UploadVideo;
