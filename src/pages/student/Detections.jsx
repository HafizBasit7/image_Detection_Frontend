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

  const rows = data?.detections || [];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Detection Reports
      </Typography>

      {isLoading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : isError ? (
        <Alert severity="error">
          {error?.response?.data?.error || error?.response?.data?.message || 'Error loading detections'}
        </Alert>
      ) : rows.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No detection reports found for your roll number.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Video</TableCell>
                <TableCell>Stats</TableCell>
                <TableCell>Detected By</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <a
                      href={row.output_video_url || row.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Video
                    </a>
                  </TableCell>
                  <TableCell>
                    {row.stats || JSON.stringify(row.detection_data?.data || {})}
                  </TableCell>
                  <TableCell>{row.created_by_name || 'N/A'}</TableCell>
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
