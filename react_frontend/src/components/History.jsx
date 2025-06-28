// components/History.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { 
  MonetizationOn, 
  ArrowBack, 
  SupportAgent, 
  History as HistoryIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { historyService } from '../services/historyService';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    totalTickets: 0,
    openTickets: 0
  });

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await historyService.getActivityHistory(user.id);
      setHistory(data);
      
      // Calculate statistics
      const payments = data.filter(item => item.type === 'payment');
      const tickets = data.filter(item => item.type === 'ticket');
      const openTickets = tickets.filter(ticket => 
        ticket.status === 'open' || ticket.status === 'in progress'
      );
      
      setStats({
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
        totalTickets: tickets.length,
        openTickets: openTickets.length
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load activity history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getStatusColor = (status, type) => {
    if (type === 'payment') return 'success';
    
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'warning';
      case 'open': return 'info';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'MonetizationOn': return <MonetizationOn />;
      case 'SupportAgent': return <SupportAgent />;
      default: return <HistoryIcon />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return `KES ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography ml={2}>Loading activity history...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Activity History</Typography>
      <Typography variant="body1" mb={3}>
        A complete record of all your payments and support activities.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2} mb={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Total Payments
            </Typography>
            <Typography variant="h5">
              {stats.totalPayments}
            </Typography>
            <Typography variant="body2" color="success.main">
              {formatAmount(stats.totalAmount)}
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Support Tickets
            </Typography>
            <Typography variant="h5">
              {stats.totalTickets}
            </Typography>
            <Typography variant="body2" color={stats.openTickets > 0 ? "warning.main" : "success.main"}>
              {stats.openTickets} open
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {history.length === 0 ? (
        <Box textAlign="center" py={4}>
          <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            No activity history yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your payments and support tickets will appear here
          </Typography>
        </Box>
      ) : (
      <List>
          {history.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem divider>
            <ListItemIcon>
                  {getIcon(item.icon)}
            </ListItemIcon>
            <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="subtitle1">
                        {item.title}
                      </Typography>
                      <Chip 
                        label={item.status} 
                        size="small"
                        color={getStatusColor(item.status, item.type)}
                      />
                      {item.urgency && (
                        <Chip 
                          label={item.urgency} 
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.date)}
                      </Typography>
                    </>
                  }
            />
                {item.amount && (
                  <Box textAlign="right">
                    <Typography variant="h6" color="success.main">
                      {formatAmount(item.amount)}
                    </Typography>
                  </Box>
                )}
          </ListItem>
              {index < history.length - 1 && <Divider />}
            </React.Fragment>
        ))}
      </List>
      )}

      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        sx={{ mt: 4 }}
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default PaymentHistory;
