import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Button,
  useTheme
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  CalendarToday as DateIcon,
  Security as SecurityIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useGeneralDetections } from '../../api/mutation';

const GeneralDetections = () => {
  const theme = useTheme();
  const { data, isLoading, isError, error } = useGeneralDetections();
  const rows = data?.results || [];

  // Utility to download file
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
    } catch (err) {
      console.error('Download failed:', err);
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
    <Box sx={{ flexGrow: 1 }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          My Recognition Records
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isLoading
            ? 'Fetching your detection history...'
            : `${rows.length} record${rows.length === 1 ? '' : 's'} found`}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={50} />
        </Box>
      ) : isError ? (
        <Alert severity="error">
          {error?.response?.data?.message || 'Failed to fetch detection history.'}
        </Alert>
      ) : rows.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No detections found
          </Typography>
          <Typography variant="body1">
            Your recognition history will appear here once your face is detected.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Summary card */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Recognitions
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {rows.length}
            </Typography>
          </Paper>

          {/* Table */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableCell sx={{ fontWeight: 600 }}>Roll Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Video</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Screenshots</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Stats</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const screenshots =
                      row.screenshots_list || (row.screenshots_urls?.split(',') || []);

                    return (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                              {row.roll_number?.charAt(0).toUpperCase() || 'G'}
                            </Avatar>
                            <Typography variant="body2">{row.roll_number || 'N/A'}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          {row.output_video_url || row.video_url ? (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VideoIcon />}
                              onClick={() =>
                                window.open(row.output_video_url || row.video_url, '_blank')
                              }
                            >
                              View Video
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not available
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {screenshots.length > 0 ? (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ImageIcon />}
                              onClick={() => handleDownloadScreenshots(screenshots)}
                            >
                              {`Download (${screenshots.length})`}
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No screenshots
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                            {row.stats || JSON.stringify(row.detection_data?.data || {})}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack>
                            <Typography variant="body2">
                              {new Date(row.created_at).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(row.created_at).toLocaleTimeString()}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<SecurityIcon />}
                            onClick={() => console.log('View details for ID:', row.id)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default GeneralDetections;
