"use client";

import { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { log } from '../logging_middleware';

const features = [
  {
    title: 'Live alerts',
    description: 'Surface important updates in real time with a clear notification flow.'
  },
  {
    title: 'Role-based routing',
    description: 'Deliver the right message to admins, staff, and end users.'
  },
  {
    title: 'Audit-friendly logs',
    description: 'Keep actions traceable with structured notification history.'
  }
];

export default function HomePage() {
  const [logStatus, setLogStatus] = useState('No log sent yet.');

  const handleSendTestLog = async () => {
    setLogStatus('Sending test log...');

    try {
      const response = await log({
        stack: 'frontend',
        level: 'info',
        package: 'page',
        message: 'homepage button clicked'
      });

      setLogStatus(`Log sent: ${response.logID}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown logging error';
      setLogStatus(`Log failed: ${message}`);
    }
  };

  return (
    <Box className="page-shell">
      <Box className="hero-panel">
        <Stack spacing={3} sx={{ maxWidth: 760 }}>
          <Chip label="Next.js + TypeScript + Material UI" color="primary" variant="outlined" sx={{ width: 'fit-content' }} />
          <Typography variant="h1" component="h1">
            Notification system frontend built for fast, clear updates.
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(16, 24, 40, 0.78)', fontWeight: 400, lineHeight: 1.6 }}>
            This starter uses Next.js with TypeScript, Material UI for components, and vanilla CSS for the global layout.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" size="large" onClick={handleSendTestLog}>
              Send test log
            </Button>
            <Button variant="outlined" size="large">
              Open dashboard
            </Button>
          </Stack>
          <Typography variant="body2" sx={{ color: 'rgba(16, 24, 40, 0.62)' }}>
            {logStatus}
          </Typography>
        </Stack>
      </Box>

      <Grid container spacing={3} className="feature-grid">
        {features.map((feature) => (
          <Grid key={feature.title} item xs={12} md={4}>
            <Card className="feature-card" elevation={0}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(16, 24, 40, 0.72)', lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}