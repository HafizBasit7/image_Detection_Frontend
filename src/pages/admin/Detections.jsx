import React from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button,
} from '@mui/material';
import { useAdminDetections } from '../../api/mutation';

const Detections = () => {
  const { data, isLoading } = useAdminDetections();

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Failed to download: ${filename}`);
    }
  };

  const handleDownloadScreenshots = (screenshots) => {
    if (!Array.isArray(screenshots) || screenshots.length === 0) return;

    screenshots.forEach((relativeUrl) => {
      const fullUrl = `http://127.0.0.1:8000${relativeUrl}`;
      const parts = relativeUrl.split('/');
      const filename = parts[parts.length - 1];
      downloadFile(fullUrl, filename);
    });
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Detections
      </Typography>

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
                <TableCell>Download</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results?.map((row) => {
                const stats = row.stats ? JSON.parse(row.stats) : null;

                // Prefer screenshots_list array, fallback to comma-separated screenshots_urls
                const screenshots = Array.isArray(row.screenshots_list)
                  ? row.screenshots_list
                  : row.screenshots_urls?.split(',') ?? [];

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.roll_number}</TableCell>

                    <TableCell>
                      {stats ? (
                        <>
                          <div>
                            <strong>Total Detections:</strong> {stats.total_detections}
                          </div>
                          <div>
                            <strong>Confidence Score:</strong> {stats.confidence_score}
                          </div>
                          <div>
                            <strong>Duration Detected:</strong> {stats.duration_detected}
                          </div>
                          <div>
                            <strong>Frames Detected:</strong> {stats.frames_detected?.join(', ')}
                          </div>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>

                    <TableCell>
                      {row.video_url ? (
                        <a href={row.video_url} target="_blank" rel="noopener noreferrer">
                          View Video
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>

                    <TableCell>
                      {screenshots.length > 0 ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownloadScreenshots(screenshots)}
                        >
                          Download Screenshots
                        </Button>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>

                    <TableCell>
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Detections;
