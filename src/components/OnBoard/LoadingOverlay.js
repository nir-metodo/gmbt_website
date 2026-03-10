// LoadingOverlay.js
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './LoadingOverlay.css';

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null; // Only render if loading is true

  return (
    <div className="loading-overlay">
      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
        <CircularProgress color="primary" />
      </Box>
    </div>
  );
};

export default LoadingOverlay;
