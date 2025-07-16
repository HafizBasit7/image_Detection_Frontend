import React from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useGeneralDetections } from '../../api/mutation';

const GeneralDetections = () => {
  const { data, isLoading, isError, error } = useGeneralDetections();

  const rows = data?.results || []; // ✅ Use results from paginated response

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        My Detections
      </Typography>

      {isLoading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : isError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error?.response?.data?.message || 'Failed to fetch detections'}
        </Alert>
      ) : rows.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No detections found.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Roll Number</TableCell>
                <TableCell>Video</TableCell>
                <TableCell>Stats</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.roll_number || 'N/A'}</TableCell>
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

export default GeneralDetections;
