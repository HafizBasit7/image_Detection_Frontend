// src/pages/student/Detections.jsx
import React from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useStudentDetections } from '../../api/mutation';

const StudentDetections = () => {
  const { data, isLoading, isError, error } = useStudentDetections();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Detection Reports
      </Typography>

      {isLoading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : isError ? (
        <Alert severity="error">{error?.response?.data?.message || 'Error loading detections'}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Video</TableCell>
                <TableCell>Stats</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <a href={row.output_video_url || row.video_url} target="_blank" rel="noopener noreferrer">
                      View Video
                    </a>
                  </TableCell>
                  <TableCell>
                    {row.stats || JSON.stringify(row.detection_data?.data || {})}
                  </TableCell>
                  <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StudentDetections;
