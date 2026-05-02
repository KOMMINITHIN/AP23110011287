"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import type { NotificationItem, NotificationType, NotificationsResponse } from '../lib/notifications';

const limitOptions = [5, 10, 15, 20];
const notificationTypes: Array<'All' | NotificationType> = ['All', 'Event', 'Result', 'Placement'];
const studentProfile = {
  name: 'Nithin Kommi',
  rollNo: 'AP23110011287',
  email: 'nithin_kommi@srmap.edu.in'
};

function formatTimestamp(timestamp: string) {
  return timestamp.replace(' ', ' · ');
}

async function sendLog(payload: {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';
  message: string;
}) {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch {
    // Ignore logging failures so the dashboard still loads.
  }
}

async function fetchNotifications(options: {
  limit: number;
  page: number;
  notificationType: 'All' | NotificationType;
}): Promise<NotificationsResponse> {
  const params = new URLSearchParams({
    limit: String(options.limit),
    page: String(options.page)
  });

  if (options.notificationType !== 'All') {
    params.set('notification_type', options.notificationType);
  }

  const response = await fetch(`/api/notifications?${params.toString()}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorBody.error || `Notification request failed with status ${response.status}`);
  }

  return (await response.json()) as NotificationsResponse;
}

export default function HomePage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [notificationType, setNotificationType] = useState<'All' | NotificationType>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Waiting for notifications...');

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      setLoading(true);
      setError('');

      void sendLog({
        stack: 'frontend',
        level: 'info',
        package: 'page',
        message: `notifications view requested: page=${page}, limit=${limit}, type=${notificationType}`
      });

      try {
        const response = await fetchNotifications({
          limit,
          page,
          notificationType
        });

        if (!active) {
          return;
        }

        setNotifications(response.notifications);
        setStatus(`Loaded ${response.notifications.length} notification${response.notifications.length === 1 ? '' : 's'}.`);
        void sendLog({
          stack: 'frontend',
          level: 'info',
          package: 'api',
          message: `notifications loaded successfully: ${response.notifications.length} item(s)`
        });
      } catch (fetchError) {
        if (!active) {
          return;
        }

        const message = fetchError instanceof Error ? fetchError.message : 'Unknown notifications error';
        setError(message);
        setStatus('Unable to load notifications.');
        void sendLog({
          stack: 'frontend',
          level: 'error',
          package: 'api',
          message: `notifications fetch failed: ${message}`
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      active = false;
    };
  }, [limit, notificationType, page]);

  const typeSummary = useMemo(() => {
    if (notificationType === 'All') {
      return 'All notification types';
    }

    return `${notificationType} notifications`;
  }, [notificationType]);

  const latestTimestamp = notifications[0]?.Timestamp ?? 'No data yet';

  return (
    <Box className="page-shell dashboard-shell">

      {/* ── Brand row ── */}
      <Box className="brand-row">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Logo mark */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2158d4 0%, #0a7a5a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(33,88,212,0.28)'
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1 }}>A</Typography>
          </Box>
          <Box>
            <Typography className="brand-title" variant="h2" component="p">
              AFFORDMED
            </Typography>
            <Typography className="brand-subtitle" variant="body2">
              Technology, Innovation &amp; Affordability
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Protected GET /notifications"
          color="secondary"
          variant="outlined"
          size="small"
          sx={{ fontWeight: 600, fontSize: '0.72rem', borderRadius: '8px' }}
        />
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }} className="dashboard-grid">

        {/* ── Left panel: controls ── */}
        <Grid item xs={12} lg={4}>
          <Paper className="hero-panel control-surface" elevation={0}>
            <Stack spacing={3}>

              {/* Header */}
              <Box>
                <Chip
                  label="Campus Notifications Microservice"
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1.5, fontWeight: 600, fontSize: '0.72rem', borderRadius: '8px' }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '1.7rem', sm: '2rem', md: '2.4rem' },
                    mb: 1.5,
                    lineHeight: 1.18,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Real-time campus updates.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(16, 24, 40, 0.62)', lineHeight: 1.75 }}
                >
                  Fetches protected notifications with page and type filtering. Every interaction is logged through the required middleware.
                </Typography>
              </Box>

              {/* Stats cards */}
              <Stack spacing={1.5} className="stats-grid">

                {/* Student profile */}
                <Card className="feature-card" elevation={0}>
                  <CardContent sx={{ p: '14px 16px !important' }}>
                    <Typography className="section-label">Student profile</Typography>
                    <Stack spacing={0.4} sx={{ mt: 1 }}>
                      <Typography variant="h6" component="p" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        {studentProfile.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(16, 24, 40, 0.62)', fontSize: '0.8rem' }}>
                        {studentProfile.rollNo}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(16, 24, 40, 0.62)', fontSize: '0.8rem', wordBreak: 'break-word' }}
                      >
                        {studentProfile.email}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Status + Active filter row */}
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Card className="feature-card" elevation={0} sx={{ height: '100%' }}>
                      <CardContent sx={{ p: '14px 16px !important' }}>
                        <Typography className="section-label">Status</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.75,
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            color: loading ? 'rgba(16,24,40,0.5)' : error ? '#c0392b' : '#2158d4',
                            lineHeight: 1.4
                          }}
                        >
                          {loading ? 'Loading…' : status}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card className="feature-card" elevation={0} sx={{ height: '100%' }}>
                      <CardContent sx={{ p: '14px 16px !important' }}>
                        <Typography className="section-label">Filter</Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.75, fontWeight: 600, fontSize: '0.82rem', color: '#0a7a5a', lineHeight: 1.4 }}
                        >
                          {typeSummary}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Latest timestamp */}
                <Card className="feature-card" elevation={0}>
                  <CardContent sx={{ p: '14px 16px !important' }}>
                    <Typography className="section-label">Latest timestamp</Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.75, fontWeight: 600, fontSize: '0.82rem', color: 'rgba(16,24,40,0.78)', lineHeight: 1.4 }}
                    >
                      {latestTimestamp}
                    </Typography>
                  </CardContent>
                </Card>

              </Stack>

              <Divider sx={{ borderColor: 'rgba(16,24,40,0.07)' }} />

              {/* Controls */}
              <Stack spacing={2.5}>
                <Box>
                  <Typography className="section-label">Controls</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(16, 24, 40, 0.58)', mt: 0.5, fontSize: '0.8rem' }}>
                    Adjust the filter, limit, or page to refresh the feed.
                  </Typography>
                </Box>

                {/* Type filter */}
                <ToggleButtonGroup
                  exclusive
                  value={notificationType}
                  onChange={(_, value) => {
                    if (!value) {
                      return;
                    }
                    setPage(1);
                    setNotificationType(value);
                    void sendLog({
                      stack: 'frontend',
                      level: 'info',
                      package: 'component',
                      message: `notification type changed to ${value}`
                    });
                  }}
                  className="filter-group"
                >
                  {notificationTypes.map((type) => (
                    <ToggleButton key={type} value={type} className="filter-toggle">
                      {type}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                {/* Limit + Page */}
                <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1.5}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="limit-label">Limit</InputLabel>
                    <Select
                      labelId="limit-label"
                      value={limit}
                      label="Limit"
                      sx={{ borderRadius: '12px' }}
                      onChange={(event) => {
                        const nextLimit = Number(event.target.value);
                        setPage(1);
                        setLimit(nextLimit);
                        void sendLog({
                          stack: 'frontend',
                          level: 'info',
                          package: 'component',
                          message: `notification limit changed to ${nextLimit}`
                        });
                      }}
                    >
                      {limitOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Page"
                    type="number"
                    value={page}
                    size="small"
                    inputProps={{ min: 1, step: 1 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    onChange={(event) => {
                      const nextPage = Math.max(1, Number(event.target.value || 1));
                      setPage(nextPage);
                      void sendLog({
                        stack: 'frontend',
                        level: 'debug',
                        package: 'state',
                        message: `notification page changed to ${nextPage}`
                      });
                    }}
                    fullWidth
                  />
                </Stack>

                {/* Pagination */}
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.1,
                      boxShadow: '0 4px 14px rgba(33,88,212,0.25)',
                      '&:hover': { boxShadow: '0 6px 20px rgba(33,88,212,0.32)' }
                    }}
                    onClick={() => {
                      setPage((currentPage) => currentPage + 1);
                      void sendLog({
                        stack: 'frontend',
                        level: 'info',
                        package: 'page',
                        message: 'pagination advanced to the next page'
                      });
                    }}
                  >
                    Next page
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.1,
                      borderColor: 'rgba(33,88,212,0.28)',
                      color: '#2158d4',
                      '&:hover': { borderColor: '#2158d4', background: 'rgba(33,88,212,0.04)' }
                    }}
                    onClick={() => {
                      setPage((currentPage) => Math.max(1, currentPage - 1));
                      void sendLog({
                        stack: 'frontend',
                        level: 'info',
                        package: 'page',
                        message: 'pagination moved to the previous page'
                      });
                    }}
                  >
                    Previous
                  </Button>
                </Stack>

                {/* Page indicator */}
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'center', color: 'rgba(16,24,40,0.42)', fontSize: '0.75rem' }}
                >
                  Page {page} · {limit} per page
                </Typography>
              </Stack>

              {error ? (
                <Alert
                  severity="error"
                  sx={{ borderRadius: '12px', fontSize: '0.82rem' }}
                >
                  {error}
                </Alert>
              ) : null}

            </Stack>
          </Paper>
        </Grid>

        {/* ── Right panel: notifications ── */}
        <Grid item xs={12} lg={8}>
          <Paper className="hero-panel notification-panel" elevation={0}>
            <Stack spacing={3}>

              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '1.9rem', md: '2.2rem' },
                      letterSpacing: '-0.02em',
                      mb: 0.5
                    }}
                  >
                    Notifications
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(16, 24, 40, 0.58)', fontSize: '0.82rem' }}>
                    Protected API · {typeSummary} · Page {page}
                  </Typography>
                </Box>
                {!loading && notifications.length > 0 && (
                  <Chip
                    label={`${notifications.length} result${notifications.length === 1 ? '' : 's'}`}
                    size="small"
                    sx={{
                      background: 'rgba(33,88,212,0.08)',
                      color: '#2158d4',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </Box>

              <Divider sx={{ borderColor: 'rgba(16,24,40,0.07)' }} />

              {/* Content */}
              {loading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index} className="notification-card" elevation={0}>
                      <CardContent sx={{ p: '16px 20px !important' }}>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <SkeletonBar width="80px" height={22} />
                            <SkeletonBar width="110px" height={14} />
                          </Stack>
                          <SkeletonBar />
                          <SkeletonBar width="65%" />
                          <SkeletonBar width="38%" height={12} />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : notifications.length ? (
                <Stack spacing={1.5} className="notification-list">
                  {notifications.map((notification) => (
                    <Card key={notification.ID} className="notification-card" elevation={0}>
                      <CardContent sx={{ p: '16px 20px !important' }}>
                        <Stack spacing={1.5}>
                          {/* Top row: type chip + timestamp */}
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={0.75}
                          >
                            <Chip
                              label={notification.Type}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                borderRadius: '7px',
                                background:
                                  notification.Type === 'Event'
                                    ? 'rgba(33,88,212,0.09)'
                                    : notification.Type === 'Result'
                                    ? 'rgba(10,122,90,0.09)'
                                    : 'rgba(120,53,15,0.09)',
                                color:
                                  notification.Type === 'Event'
                                    ? '#2158d4'
                                    : notification.Type === 'Result'
                                    ? '#0a7a5a'
                                    : '#78350f',
                                border: 'none'
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: 'rgba(16, 24, 40, 0.44)', fontSize: '0.75rem', fontFeatureSettings: '"tnum"' }}
                            >
                              {formatTimestamp(notification.Timestamp)}
                            </Typography>
                          </Stack>

                          {/* Message */}
                          <Typography
                            variant="body1"
                            component="h3"
                            sx={{ fontWeight: 600, lineHeight: 1.55, fontSize: { xs: '0.9rem', sm: '0.96rem' } }}
                          >
                            {notification.Message}
                          </Typography>

                          {/* ID */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(16, 24, 40, 0.36)',
                              fontSize: '0.72rem',
                              fontFamily: 'monospace',
                              wordBreak: 'break-all'
                            }}
                          >
                            {notification.ID}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box className="empty-state">
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      mb: 1.5,
                      opacity: 0.4,
                      userSelect: 'none'
                    }}
                  >
                    📭
                  </Typography>
                  <Typography variant="h6" component="p" gutterBottom sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    No notifications found
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(16, 24, 40, 0.56)', fontSize: '0.82rem' }}>
                    Try another page number, switch the type filter, or increase the limit.
                  </Typography>
                </Box>
              )}

            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function SkeletonBar({ width = '100%', height = 14 }: { width?: string; height?: number }) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: 999,
        background:
          'linear-gradient(90deg, rgba(33, 88, 212, 0.07) 0%, rgba(33, 88, 212, 0.14) 50%, rgba(33, 88, 212, 0.07) 100%)',
        backgroundSize: '200% 100%',
        animation: 'pulse 1.6s ease-in-out infinite'
      }}
    />
  );
}