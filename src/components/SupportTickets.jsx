import React from 'react';
import { Box, Typography, Button, Card, CardContent, Stack, Chip } from '@mui/material';
import { AccessTime, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const SupportTickets = () => {
  
  const navigate = useNavigate();

  const tickets = [
    {
      title: 'Leaky Faucet in Kitchen',
      description: 'The kitchen faucet has been dripping constantly for 3 days',
      status: 'In Progress',
      priority: 'Medium',
      date: 'Nov 20, 2024',
      icon: <AccessTime sx={{ color: '#FF9800' }} />
    },
    {
      title: 'Broken Light Fixture',
      description: 'Ceiling light in living room stopped working',
      status: 'Completed',
      priority: 'Low',
      date: 'Nov 15, 2024',
      icon: <CheckCircle sx={{ color: '#4CAF50' }} />
    }
  ];

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Support Tickets
      </Typography>
      <Typography variant="body1" mb={3}>
        Report issues and track maintenance requests
      </Typography>

      <Button variant="contained" onClick={() => navigate('/')}>
        Back to Dashboard
      </Button>
      
      <Button variant="contained" sx={{ mb: 3 }}>+ New Ticket</Button>

      <Stack spacing={2}>
        {tickets.map((ticket, index) => (
          <Card key={index}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2}>
                  {ticket.icon}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{ticket.title}</Typography>
                    <Typography variant="body2">{ticket.description}</Typography>
                  </Box>
                </Stack>
                <Box textAlign="right">
                  <Chip label={ticket.status} color={ticket.status === 'Completed' ? 'success' : 'warning'} sx={{ mb: 1 }} />
                  <Chip label={ticket.priority} variant="outlined" size="small" />
                  <Typography variant="body2" mt={1}>{ticket.date}</Typography>
                  <Button size="small" sx={{ mt: 1 }} variant="text">View Details</Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default SupportTickets;
