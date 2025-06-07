import React from 'react';
import { Box, Grid, Paper, Typography, Avatar } from '@mui/material';
import { AttachMoney, ChatBubbleOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Description, History as HistoryIcon } from '@mui/icons-material';


const cardData = [
  {
    title: 'Payments',
    description: 'View your payment status and outstanding balance',
    icon: <AttachMoney />,
    color: '#22c55e',
    path: '/payments',  // ✅ Make sure this matches the route in App.js
  },
  {
    title: 'Tickets',
    description: 'Report issues and track progress',
    icon: <ChatBubbleOutline />,
    color: '#3b82f6',
    path: '/support',
  },
  {
  title: 'Documents',
  description: 'Access and view your uploaded documents',
  icon: <Description />,
  color: '#f59e0b',
  path: '/documents',
},
{
  title: 'History',
  description: 'See your payment and request history',
  icon: <HistoryIcon />,
  color: '#8b5cf6',
  path: '/history',
}

];

const Dashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={1}>Welcome back, Tenant!</Typography>
      <Typography variant="subtitle1" mb={4}>Manage your tenancy from your personal dashboard</Typography>

      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Link to={card.path} style={{ textDecoration: 'none' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderTop: `6px solid ${card.color}`,
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="textPrimary">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {card.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
