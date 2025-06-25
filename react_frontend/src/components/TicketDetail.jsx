import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Divider,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  ArrowBack, 
  AccessTime, 
  CheckCircle, 
  Person, 
  Category,
  Edit,
  Notes
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ticketService } from '../services/ticketService';

const TicketDetail = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const { user } = useUser();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updatedTicket, setUpdatedTicket] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(parseInt(ticketId));
      
      if (!data) {
        setError('Ticket not found');
        return;
      }
      
      // Check if this ticket belongs to the current user
      if (data.tenantId !== user?.id) {
        setError('You do not have permission to view this ticket');
        return;
      }
      
      setTicket(data);
      setUpdatedTicket(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setError('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      setUpdating(true);
      
      // Update ticket details
      const updated = await ticketService.updateTicket(ticket.id, {
        title: updatedTicket.title,
        description: updatedTicket.description,
        urgency: updatedTicket.urgency,
        category: updatedTicket.category
      });
      
      setTicket(updated);
      setEditDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError('Failed to update ticket');
    } finally {
      setUpdating(false);
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
        return <CheckCircle />;
      case 'in progress':
      case 'assigned':
      default:
        return <AccessTime />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading ticket details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/support')}>
          Back to Support Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Stack direction="row" spacing={2} mb={3}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/support')}
        >
          Back to Tickets
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Edit />}
          onClick={() => setEditDialogOpen(true)}
          disabled={ticket?.status?.toLowerCase() === 'completed' || ticket?.status?.toLowerCase() === 'closed'}
        >
          Edit Ticket
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {ticket?.title || `Ticket #${ticket?.ticketID || ticket?.id}`}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                {getStatusIcon(ticket?.status)}
                <Chip 
                  label={ticket?.status || 'Open'} 
                  color={getStatusColor(ticket?.status)} 
                />
                <Chip 
                  label={ticket?.urgency || 'Medium'} 
                  variant="outlined" 
                />
              </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(ticket?.date || new Date())}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {ticket?.description || 'No description provided'}
            </Typography>
          </Box>

          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3} mb={3}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Category fontSize="small" />
                <Typography variant="subtitle2">Category</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {ticket?.category || 'General'}
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Person fontSize="small" />
                <Typography variant="subtitle2">Assigned Staff</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {ticket?.assignedStaff || 'Not assigned'}
              </Typography>
            </Box>

            {ticket?.resolutionNotes && (
              <Box gridColumn="1 / -1">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Notes fontSize="small" />
                  <Typography variant="subtitle2">Resolution Notes</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {ticket.resolutionNotes}
                </Typography>
              </Box>
            )}
          </Box>

          {ticket?.imageUrl && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Attached Image
              </Typography>
              <img 
                src={`http://localhost:8082${ticket.imageUrl}`}
                alt="Ticket attachment"
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Ticket Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Ticket</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={updatedTicket.title || ''}
              onChange={(e) => setUpdatedTicket({ ...updatedTicket, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={updatedTicket.description || ''}
              onChange={(e) => setUpdatedTicket({ ...updatedTicket, description: e.target.value })}
            />
            <TextField
              select
              label="Urgency"
              fullWidth
              value={updatedTicket.urgency || 'Medium'}
              onChange={(e) => setUpdatedTicket({ ...updatedTicket, urgency: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </TextField>
            <TextField
              select
              label="Category"
              fullWidth
              value={updatedTicket.category || 'General'}
              onChange={(e) => setUpdatedTicket({ ...updatedTicket, category: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="General">General</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Security">Security</option>
              <option value="Other">Other</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateTicket}
            variant="contained"
            disabled={updating}
          >
            {updating ? <CircularProgress size={20} /> : 'Update Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDetail; 