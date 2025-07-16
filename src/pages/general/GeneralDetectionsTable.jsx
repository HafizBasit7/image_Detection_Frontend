import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, CircularProgress
} from '@mui/material';
import { useGeneralDetections } from '../../api/mutation';

const GeneralDetectionsTable = () => {
  const { data, isLoading, isError } = useGeneralDetections();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load detections.</Typography>;

  const detections = data?.results || [];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Detection History
      </Typography>
      {detections.length === 0 ? (
        <Typography>No detections found.</Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Roll Number</TableCell>
                <TableCell>Total Detections</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Uploaded At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detections.map((det) => (
                <TableRow key={det.id}>
                  <TableCell>{det.roll_number}</TableCell>
                  <TableCell>{det.total_detections || 0}</TableCell>
                  <TableCell>{det.video_duration}</TableCell>
                  <TableCell>{new Date(det.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default GeneralDetectionsTable;
