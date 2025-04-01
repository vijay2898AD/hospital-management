import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Hospital Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Colgate Hospital's
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Providing quality healthcare services to our community since 2005.
              We are committed to excellence in patient care and medical innovation.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small" href='https://www.facebook.com/' target='_blank'>
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small" href='https://www.instagram.com/' target='_blank'>
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small" href='https://www.linkedin.com/' target='_blank'>
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <RouterLink to="/doctors" style={{ color: 'inherit', textDecoration: 'none' }}>
                Find a Doctor
              </RouterLink>
              <RouterLink to="/departments" style={{ color: 'inherit', textDecoration: 'none' }}>
                Departments
              </RouterLink>
              <RouterLink to="/appointments" style={{ color: 'inherit', textDecoration: 'none' }}>
                Book Appointment
              </RouterLink>
              <RouterLink to="/aboutus" style={{ color: 'inherit', textDecoration: 'none' }}>
                About Us
              </RouterLink>
              <RouterLink to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                Contact Us
              </RouterLink>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">
                  +91 7991234567<br />
                  +91 9012345678
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  info@ColgateHospital.com<br />
                  Colgate@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  Seethamadhara,oppsite oxygen towers Visakhapatnam<br />
                  District, Andhra Province, India
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Colgate Hospital's. All rights reserved @ vijay.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 