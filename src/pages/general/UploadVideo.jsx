// src/pages/general/UploadVideo.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Input,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useGeneralVideoUpload } from '../../api/mutation';

const GeneralUpload = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const { mutate, isPending, isError, error } = useGeneralVideoUpload();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('roll_number', rollNumber);
    formData.append('video', videoFile);

    mutate(formData, {
      onSuccess: () => {
        setSuccessMsg('Video uploaded successfully!');
        setRollNumber('');
        setVideoFile(null);
      },
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Upload Video for Detection
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.response?.data?.message || 'Upload failed. Please try again.'}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Input
            type="file"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            inputProps={{ accept: '.mp4,.avi,.mov,.mkv,.wmv' }}
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending && <CircularProgress size={18} />}
            >
              {isPending ? 'Uploading...' : 'Submit Video'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default GeneralUpload;
