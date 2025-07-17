import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { CameraAlt, Visibility, Stop, CheckCircle, Error } from '@mui/icons-material';

const LiveStream = () => {
  // Refs for DOM elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rollNumberInputRef = useRef(null);

  // State variables
  const [status, setStatus] = useState('');
  const [apiStatus, setApiStatus] = useState({ message: '', severity: 'info' });
  const [cameraMode, setCameraMode] = useState('local');
  const [rollNumber, setRollNumber] = useState('');
  const [storedFaces, setStoredFaces] = useState([]);
  const [matchFound, setMatchFound] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [matchedFace, setMatchedFace] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [showFacesDialog, setShowFacesDialog] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // API Configuration
  const API_BASE_URL = 'http://localhost:8000';
  const API_ENDPOINT = '/api/public/faces/';

  // Detection interval ref
  const detectionInterval = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // Initialize models
  const loadModels = async () => {
    try {
      setStatus('Loading models...');
      setApiStatus({ message: 'Loading face detection models...', severity: 'info' });

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/modles'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/modles'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/modles')
      ]);

      setStatus('Models loaded successfully!');
      setApiStatus({ message: 'Models loaded successfully', severity: 'success' });
      setModelsLoaded(true);
      return true;
    } catch (error) {
      setStatus('Error loading models');
      setApiStatus({ message: `Error loading models: ${error.message}`, severity: 'error' });
      return false;
    }
  };

  // Fetch stored face descriptors for a specific roll number
  const fetchStoredFaceDescriptors = async (rollNumber) => {
    try {
      setApiStatus({ message: 'Loading face data...', severity: 'info' });
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINT}?rollNumber=${rollNumber}`);
      const faces = response.data.files || [];
      
      if (faces.length === 0) {
        setApiStatus({ message: 'No faces found for this roll number', severity: 'warning' });
        return [];
      }

      const descriptors = [];
      for (const face of faces) {
        try {
          const img = await faceapi.fetchImage(face.url);
          const detections = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (detections.length > 0) {
            descriptors.push(new faceapi.LabeledFaceDescriptors(
              face.name, 
              [detections[0].descriptor]
            ));
          }
        } catch (error) {
          console.error(`Error processing face ${face.name}:`, error);
        }
      }
      
      if (descriptors.length === 0) {
        setApiStatus({ message: 'No valid face descriptors found', severity: 'warning' });
      } else {
        setApiStatus({ message: `Loaded ${descriptors.length} face descriptors`, severity: 'success' });
      }
      
      return descriptors;
    } catch (error) {
      console.error('Error fetching face descriptors:', error);
      setApiStatus({ message: `Error loading face data: ${error.message}`, severity: 'error' });
      return [];
    }
  };

  // Compare detected face with stored descriptors
  const compareFaces = (detection) => {
    if (!faceMatcher || !detection) return null;
    
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
    return {
      label: bestMatch.label,
      distance: bestMatch.distance,
      isMatch: bestMatch.distance < 0.6 // Threshold for match
    };
  };

  // Take screenshot
  const takeScreenshot = () => {
    try {
      const screenshotCanvas = document.createElement('canvas');
      const ctx = screenshotCanvas.getContext('2d');
      screenshotCanvas.width = 640;
      screenshotCanvas.height = 480;

      if (videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      }

      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, 0, 0);
      }

      const url = screenshotCanvas.toDataURL('image/png');
      setScreenshotUrl(url);
      
      // You can also save this to server if needed
      console.log('Screenshot taken');
      setApiStatus({ message: 'Screenshot captured!', severity: 'success' });
    } catch (error) {
      console.error('Error taking screenshot:', error);
      setApiStatus({ message: 'Error taking screenshot', severity: 'error' });
    }
  };

  // Face detection on video
  const detectOnVideo = async () => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
      return;
    }

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
      const resized = faceapi.resizeResults(detections, dims);
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

      if (detections.length > 0) {
        if (faceMatcher) {
          const results = compareFaces(detections[0]);
          
          if (results?.isMatch && !matchFound) {
            setMatchFound(true);
            setMatchedFace(results.label);
            setStatus(`MATCH FOUND! Face recognized for roll number: ${rollNumber}`);
            takeScreenshot();
          }
        }
      }
    } catch (error) {
      console.error('Detection error:', error);
      clearCanvas();
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Start local camera
  const startLocalCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start detection loop
      detectionInterval.current = setInterval(detectOnVideo, 500);
      return true;
    } catch (err) {
      console.error("Could not access local camera:", err);
      setError("Camera access denied or unavailable.");
      return false;
    }
  };

  // Start detection
  const startDetection = async () => {
    if (!rollNumber.trim()) {
      setApiStatus({ message: 'Please enter a roll number', severity: 'warning' });
      return;
    }

    setMatchedFace(null);
    setError('');
    setLoading(true);
    setIsDetecting(true);
    setMatchFound(false);
    setScreenshotUrl(null);

    try {
      // 1. Load models if not already loaded
      if (!modelsLoaded) {
        const modelsLoaded = await loadModels();
        if (!modelsLoaded) {
          throw new Error("Failed to load models");
        }
      }

      // 2. Fetch stored faces for this roll number
      const storedDescriptors = await fetchStoredFaceDescriptors(rollNumber);
      if (storedDescriptors.length === 0) {
        throw new Error("No face data found for this roll number");
      }

      // 3. Initialize face matcher
      setFaceMatcher(new faceapi.FaceMatcher(storedDescriptors));

      // 4. Start camera
      const cameraStarted = await startLocalCamera();
      if (!cameraStarted) {
        throw new Error("Failed to start camera");
      }

      setStatus(`Searching for face matching roll number: ${rollNumber}...`);
    } catch (err) {
      console.error("Error during detection start:", err);
      setError(err.message);
      stopDetection();
    } finally {
      setLoading(false);
    }
  };

  // Stop detection
  const stopDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    clearCanvas();
    setStatus('Detection stopped');
    setIsDetecting(false);
  };

  // View all stored faces
  const viewAllStoredFaces = async () => {
    setApiStatus({ message: 'Loading all faces...', severity: 'info' });

    try {
      const response = await axios.get(API_BASE_URL + API_ENDPOINT);
      const faces = response.data.files || [];
      setStoredFaces(faces);

      if (faces.length === 0) {
        setApiStatus({ message: 'No faces found in database', severity: 'warning' });
        return;
      }

      setApiStatus({ message: `Loaded ${faces.length} faces`, severity: 'success' });
      setShowFacesDialog(true);
    } catch (error) {
      console.error('Error loading faces:', error);
      setApiStatus({ message: `Error loading faces: ${error.message}`, severity: 'error' });
    }
  };

  const StatusIcon = ({ severity }) => {
    switch (severity) {
      case 'success': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'warning': return <Error color="warning" />;
      default: return <CircularProgress size={20} />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Face Recognition System
        </Typography>
        
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          Enter roll number and start detection
        </Typography>

        {/* Status Message */}
        {apiStatus.message && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            mb: 2,
            borderRadius: 1,
            backgroundColor: theme => {
              switch (apiStatus.severity) {
                case 'error': return theme.palette.error.light;
                case 'warning': return theme.palette.warning.light;
                case 'success': return theme.palette.success.light;
                default: return theme.palette.info.light;
              }
            }
          }}>
            <StatusIcon severity={apiStatus.severity} />
            <Typography>{apiStatus.message}</Typography>
          </Box>
        )}

        {/* Controls */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              inputRef={rollNumberInputRef}
              label="Roll Number"
              variant="outlined"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Visibility />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <RadioGroup
              row
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value)}
            >
              <FormControlLabel value="local" control={<Radio />} label="Local Camera" />
              <FormControlLabel value="external" control={<Radio />} label="External" disabled />
            </RadioGroup>
          </Grid>

          <Grid item xs={12} sm={5} sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color={isDetecting ? 'error' : 'primary'}
              onClick={isDetecting ? stopDetection : startDetection}
              disabled={!rollNumber || loading}
              startIcon={isDetecting ? <Stop /> : <CameraAlt />}
              sx={{ flex: 1 }}
            >
              {isDetecting ? 'Stop' : 'Start Detection'}
              {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
            </Button>

            <Button
              variant="outlined"
              onClick={viewAllStoredFaces}
              startIcon={<Visibility />}
            >
              View All Faces
            </Button>
          </Grid>
        </Grid>

        {/* Camera Feed */}
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: 480,
          bgcolor: 'grey.200',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 3
        }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isDetecting ? 'block' : 'none'
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isDetecting ? 'block' : 'none',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
          {!isDetecting && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'grey.500'
            }}>
              <Typography>Click "Start Detection" to begin</Typography>
            </Box>
          )}
        </Box>

        {/* Match Found Display */}
        {matchFound && (
          <Card sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'success.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle color="success" fontSize="large" />
                <Typography variant="h6" color="success.main">
                  Match Found!
                </Typography>
              </Box>
              <Typography>Roll Number: <strong>{rollNumber}</strong></Typography>
              <Typography>Matched Face: <strong>{matchedFace}</strong></Typography>
            </CardContent>
          </Card>
        )}

        {/* Screenshot Display */}
        {screenshotUrl && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CameraAlt color="primary" />
                Screenshot Captured
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={screenshotUrl} 
                  alt="Face match screenshot" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: 4,
                    border: '1px solid #ddd'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>

      {/* All Faces Dialog */}
      <Dialog 
        open={showFacesDialog} 
        onClose={() => setShowFacesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>All Stored Faces</DialogTitle>
        <DialogContent dividers>
          {storedFaces.length === 0 ? (
            <Typography>No faces found in database</Typography>
          ) : (
            <Grid container spacing={2}>
              {storedFaces.map((face, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card>
                    <Box sx={{ 
                      height: 140, 
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={face.url}
                        alt={face.name}
                        style={{ 
                          width: '100%', 
                          height: 'auto',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="body2" noWrap>{face.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFacesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LiveStream;