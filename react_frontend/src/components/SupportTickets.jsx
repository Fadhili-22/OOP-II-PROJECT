import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { AccessTime, CheckCircle, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ticketService } from '../services/ticketService';

const SupportTickets = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    urgency: 'Medium',
    category: 'General'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching tickets for user ID: ${user.id}`);
      const allTickets = await ticketService.getAllTickets();
      console.log('All tickets received:', allTickets);
      // Filter tickets for current tenant (in a real app, this would be done on the backend)
      const userTickets = allTickets.filter(ticket => ticket.tenantId === user.id);
      console.log('User tickets:', userTickets);
      setTickets(userTickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(`Failed to load tickets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async () => {
    if (!newTicket.description.trim()) {
      setError('Please enter a description for your ticket');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const ticketData = {
        ...newTicket,
        tenantId: user.id,
        status: 'Open',
        date: new Date().toISOString()
      };
      
      console.log('Creating ticket:', ticketData);
      const createdTicket = await ticketService.createTicket(ticketData);
      console.log('Ticket created:', createdTicket);
      
      setOpenDialog(false);
      setNewTicket({ title: '', description: '', urgency: 'Medium', category: 'General' });
      await fetchTickets(); // Refresh tickets list
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(`Failed to create ticket: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'closed':
        return 'success';
      case 'in progress':
      case 'assigned':
        return 'warning';
      case 'open':
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'closed':
        return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'in progress':
      case 'assigned':
      default:
        return <AccessTime sx={{ color: '#FF9800' }} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
          Loading support tickets...
        </Typography>
      </Box>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <Box p={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Support Tickets
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchTickets} sx={{ mr: 2 }}>
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
        Support Tickets
      </Typography>
      <Typography variant="body1" mb={3}>
        Report issues and track maintenance requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={2} mb={3}>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          New Ticket
        </Button>
      </Stack>

      {tickets.length > 0 ? (
        <Stack spacing={2}>
          {tickets.map((ticket, index) => (
            <Card key={ticket.id || index}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2}>
                    {getStatusIcon(ticket.status)}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {ticket.title || ticket.description?.substring(0, 50) + '...'}
                      </Typography>
                      <Typography variant="body2">
                        {ticket.description}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box textAlign="right">
                    <Chip 
                      label={ticket.status || 'Open'} 
                      color={getStatusColor(ticket.status)} 
                      sx={{ mb: 1 }} 
                    />
                    <Chip 
                      label={ticket.urgency || 'Medium'} 
                      variant="outlined" 
                      size="small" 
                    />
                    <Typography variant="body2" mt={1}>
                      {formatDate(ticket.date || new Date())}
                    </Typography>
                    <Button 
                      size="small" 
                      sx={{ mt: 1 }} 
                      variant="text"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1" color="textSecondary">
              No tickets found. Create your first support ticket to get help with any issues.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Support Ticket</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              required
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Urgency</InputLabel>
              <Select
                value={newTicket.urgency}
                label="Urgency"
                onChange={(e) => setNewTicket({ ...newTicket, urgency: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newTicket.category}
                label="Category"
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              >
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Plumbing">Plumbing</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateTicket} 
            variant="contained"
            disabled={!newTicket.description.trim() || submitting}
          >
            {submitting ? <CircularProgress size={20} /> : 'Create Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupportTickets;
