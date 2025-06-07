// components/History.jsx
import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MonetizationOn, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const navigate = useNavigate();

  const paymentRecords = [
    { description: 'Rent - May 2025', amount: '₦350,000', date: '2025-05-01' },
    { description: 'Rent - April 2025', amount: '₦350,000', date: '2025-04-01' },
    { description: 'Utility Bill - March', amount: '₦25,000', date: '2025-03-25' },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Payment History</Typography>
      <Typography variant="body1" mb={3}>A record of all your completed payments.</Typography>

      <List>
        {paymentRecords.map((record, index) => (
          <ListItem key={index} divider>
            <ListItemIcon>
              <MonetizationOn />
            </ListItemIcon>
            <ListItemText
              primary={`${record.description} — ${record.amount}`}
              secondary={`Date: ${record.date}`}
            />
          </ListItem>
        ))}
      </List>

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
