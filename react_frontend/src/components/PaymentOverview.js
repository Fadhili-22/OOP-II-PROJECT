import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, Card, CardContent, Chip, Stack, Button, CircularProgress, Alert } from '@mui/material';
import { CheckCircle, ErrorOutline, EventNote, AttachMoney } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { paymentService } from '../services/paymentService';

const PaymentOverview = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching payment data for user ID: ${user.id}`);
      const summary = await paymentService.getPaymentSummary(user.id);
      console.log('Payment summary received:', summary);
      setPaymentSummary(summary);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError(`Failed to load payment data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading payment data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Payment Overview
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchPaymentData} sx={{ mr: 2 }}>
          Retry
        </Button>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Payment Overview
      </Typography>
      <Typography variant="body1" mb={4}>
        Track your rent payments and balance
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mb: 4 }}>
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
                  <Typography variant="h6" color="#4CAF50">
                    {formatCurrency(paymentSummary?.totalPaid || 0)}
                  </Typography>
                  <Typography variant="body2">
                    {paymentSummary?.totalPayments || 0} payments
                  </Typography>
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
                  <Typography variant="h6" color="#FF5722">
                    {formatCurrency(paymentSummary?.amountDue || 0)}
                  </Typography>
                  <Typography variant="body2">
                    Due: {formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1))}
                  </Typography>
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
                  <Typography variant="h6" color="#2979FF">
                    {formatCurrency(paymentSummary?.monthlyRent || 0)}
                  </Typography>
                  <Typography variant="body2">
                    Due: {formatDate(paymentSummary?.nextPaymentDate || new Date())}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Payments */}
      <Box mt={6}>
        <Typography variant="h6" mb={2}>Recent Payments</Typography>
        {paymentSummary?.recentPayments?.length > 0 ? (
          <Stack spacing={2}>
            {paymentSummary.recentPayments.map((payment, index) => (
              <Card key={index}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <AttachMoney sx={{ color: '#4CAF50' }} />
                      <Box>
                        <Typography variant="body1">
                          {formatCurrency(payment.amount)}
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(payment.date)}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label="Paid" color="success" />
                      <Typography variant="body2">Bank Transfer</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary">
                No recent payments found.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default PaymentOverview;
