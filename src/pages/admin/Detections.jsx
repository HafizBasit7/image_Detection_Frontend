import React from 'react';
import {
  Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, TableContainer
} from '@mui/material';
import { useAdminDetections } from '../../api/mutation';

const Detections = () => {
  const { data, isLoading } = useAdminDetections();

  return (
    <div>
      <Typography variant="h5" gutterBottom>Detections</Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Roll Number</TableCell>
                <TableCell>Stats</TableCell>
                <TableCell>Video</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.roll_number}</TableCell>
                  <TableCell>{row.stats}</TableCell>
                  <TableCell>
                    <a href={row.video_url} target="_blank" rel="noopener noreferrer">Video</a>
                  </TableCell>
                  <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Detections;
