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
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import { useAdminVideoUpload } from '../../api/mutation';

const UploadVideo = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [video, setVideo] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [submittedRollNumber, setSubmittedRollNumber] = useState('');

  const { mutate, isPending, isError, isSuccess, error } = useAdminVideoUpload();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('roll_number', rollNumber);
    formData.append('video', video);

    mutate(formData, {
      onSuccess: (data) => {
        setSuccessMsg('Video uploaded successfully!');
        setSubmittedRollNumber(rollNumber);
        setResponseData(data?.detection_data);
        setRollNumber('');
        setVideo(null);
      },
    });
  };

  const hasDetections =
    responseData?.status === 'success' &&
    Array.isArray(responseData?.data?.detections) &&
    responseData.data.detections.length > 0;

  const detectedScreenshots =
    hasDetections &&
    responseData.data.detections
      .map((det) => det.screenshot_file)
      .filter(Boolean)
      .map((filepath) => ({
        filepath,
        url: `http://127.0.0.1:8000${filepath}`,
      }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Upload Video (Admin)
      </Typography>

      <Paper sx={{ p: 3 }}>
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

        {responseData && (
          <Alert severity={hasDetections ? 'success' : 'warning'} sx={{ mb: 2 }}>
            {hasDetections
              ? 'Detections found successfully.'
              : `No detections found — roll number "${submittedRollNumber}" was not detected in the video.`}
          </Alert>
        )}

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
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isPending}
            startIcon={isPending && <CircularProgress size={18} />}
          >
            {isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </Paper>

      {/* Screenshots Section */}
      {hasDetections && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Detected Screenshots
          </Typography>

          {detectedScreenshots && detectedScreenshots.length > 0 ? (
            <Grid container spacing={2}>
              {detectedScreenshots.map((ss, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={ss.url}
                      alt={ss.filepath}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              No screenshots available.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UploadVideo;
