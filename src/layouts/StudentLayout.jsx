import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  CssBaseline,
  ListItemIcon,
  Button,
} from '@mui/material';
import {
  Dashboard,
  Face,
  CameraAlt,
  Menu as MenuIcon,
  Logout,
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const StudentLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Student';

  const navItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/student' },
    { text: 'My Face Record', icon: <Face />, path: '/student/upload' },
    { text: 'Detections', icon: <CameraAlt />, path: '/student/detections' },
    { label: 'Profile',icon: <Face />, path: '/student/profile' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Student Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map(({ text, icon, path }) => (
          <ListItem
            button
            key={text}
            selected={location.pathname === path}
            onClick={() => navigate(path)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Welcome, {username}
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Page content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default StudentLayout;
