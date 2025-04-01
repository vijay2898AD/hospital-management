import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  Dashboard,
  CalendarToday,
  LocalHospital,
  People,
  Settings,
  ExitToApp,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, loading, error, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setShowError(true);
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  const getMenuItems = () => {
    if (!user) {
      return [
        { text: 'Home', path: '/', icon: <Dashboard /> },
        { text: 'Doctors', path: '/doctors', icon: <LocalHospital /> },
        { text: 'Departments', path: '/departments', icon: <People /> },
        { text: 'Login', path: '/login', icon: <Person /> },
        { text: 'Register', path: '/register', icon: <Person /> },
      ];
    }

    const commonItems = [
      { text: 'Dashboard', path: `/${user.role}/dashboard`, icon: <Dashboard /> },
    ];

    switch (user.role) {
      case 'patient':
        return [
          ...commonItems,
          { text: 'Appointments', path: '/appointments', icon: <CalendarToday /> },
          { text: 'Prescriptions', path: '/prescriptions', icon: <LocalHospital /> },
          { text: 'Profile', path: '/patient/profile', icon: <Person /> },
        ];
      case 'doctor':
        return [
          ...commonItems,
          { text: 'Profile', path: '/doctor/profile', icon: <Person /> },
        ];
      case 'admin':
        return [
          ...commonItems,
          { text: 'Profile', path: '/admin/profile', icon: <Person /> },
        ];
      default:
        return commonItems;
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Colgate Hospital's
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {user && (
          <>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <CircularProgress color="inherit" size={24} />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
            }}
          >
            Colgate Hospital's
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getMenuItems().map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    mx: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
              {user && (
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    ml: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Person />
                </IconButton>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          component={RouterLink}
          to={`/${user?.role}/profile`}
          onClick={handleMenuClose}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Snackbar
        open={showError || Boolean(error)}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error || 'An error occurred. Please try again.'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;