import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Chip, Stack, Button } from '@mui/material';
import { CheckCircle, ErrorOutline, EventNote, AttachMoney } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PaymentOverview = () => {

   const navigate = useNavigate();

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Payment Overview
      </Typography>
      <Typography variant="body1" mb={4}>
        Track your rent payments and balance
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Back to Dashboard
      </Button>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderLeft: '6px solid #4CAF50' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle sx={{ color: '#4CAF50' }} />
                <Box>
                  <Typography variant="subtitle2">Total Paid</Typography>
                  <Typography variant="h6" color="#4CAF50">KSH 14,400</Typography>
                  <Typography variant="body2">12 months</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderLeft: '6px solid #FF9800' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <ErrorOutline sx={{ color: '#FF9800' }} />
                <Box>
                  <Typography variant="subtitle2">Amount Due</Typography>
                  <Typography variant="h6" color="#FF5722">KSH 1,200</Typography>
                  <Typography variant="body2">Due: Dec 1, 2024</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderLeft: '6px solid #2196F3' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <EventNote sx={{ color: '#2196F3' }} />
                <Box>
                  <Typography variant="subtitle2">Next Payment</Typography>
                  <Typography variant="h6" color="#2979FF">KSH 1,200</Typography>
                  <Typography variant="body2">Due: Jan 1, 2025</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Payments */}
      <Box mt={6}>
        <Typography variant="h6" mb={2}>Recent Payments</Typography>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: '#4CAF50' }} />
                <Box>
                  <Typography variant="body1">KSH 1,200</Typography>
                  <Typography variant="body2">Nov 1, 2024</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label="Paid" color="success" />
                <Typography variant="body2">Bank Transfer</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PaymentOverview;
