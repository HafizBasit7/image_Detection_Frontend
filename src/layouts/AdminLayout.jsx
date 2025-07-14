import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Button,
} from '@mui/material';
import { useLogoutMutation } from '../api/mutation';

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Create User', path: '/admin/users' },
    { label: 'Upload Face', path: '/admin/upload-face' },
    { label: 'Upload Video', path: '/admin/upload-video' },
    { label: 'Detections', path: '/admin/detections' },
    { label: 'Profile', path: '/admin/profile' }, // ✅ New nav item
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  '&.active': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
