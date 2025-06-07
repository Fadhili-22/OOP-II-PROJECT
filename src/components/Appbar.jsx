import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';


export default function appbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
         <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            Tenant Portal
          </Typography>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

          <Button color="inherit">Tenant</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

<div>
<Link to="/payments">
  <Button variant="contained" color="success">Payments</Button>
</Link>

<Link to="/support">
  <Button variant="contained" color="primary">Support</Button>
</Link>;
</div>
