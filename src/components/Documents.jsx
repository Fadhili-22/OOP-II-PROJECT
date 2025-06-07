// components/DocumentCenter.jsx
import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Description, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DocumentCenter = () => {
  const navigate = useNavigate();

  const documents = [
    { name: 'Lease_Agreement.pdf', uploaded: '2024-08-12' },
    { name: 'Utility_Bill_April.pdf', uploaded: '2025-04-30' },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Document Center</Typography>
      <Typography variant="body1" mb={3}>Access your uploaded documents below.</Typography>

      <List>
        {documents.map((doc, index) => (
          <ListItem key={index} divider>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText
              primary={doc.name}
              secondary={`Uploaded on ${doc.uploaded}`}
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

export default DocumentCenter;
