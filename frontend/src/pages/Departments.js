import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LocalHospital,
  People,
  AccessTime,
  MedicalServices,
  Schedule,
  Business,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/departments');
        if (response.data && Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to fetch departments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleViewDoctors = (departmentName) => {
    navigate('/doctors', { state: { department: departmentName } });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Departments
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explore our specialized medical departments and services
      </Typography>

      <Grid container spacing={3}>
        {departments.map((department) => (
          <Grid item xs={12} sm={6} key={department._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospital sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2">
                    {department.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {department.description}
                </Typography>

                <List dense>
                  {department.specializations && (
                    <ListItem>
                      <ListItemIcon>
                        <MedicalServices />
                      </ListItemIcon>
                      <ListItemText
                        primary="Specializations"
                        secondary={department.specializations.join(', ')}
                      />
                    </ListItem>
                  )}
                  
                  {department.facilities && (
                    <ListItem>
                      <ListItemIcon>
                        <Business />
                      </ListItemIcon>
                      <ListItemText
                        primary="Facilities"
                        secondary={department.facilities.join(', ')}
                      />
                    </ListItem>
                  )}

                  {department.workingHours && (
                    <ListItem>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary="Working Hours"
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              Mon-Fri: {department.workingHours.monday}
                              <br />
                              Sat: {department.workingHours.saturday}
                              <br />
                              Sun: {department.workingHours.sunday}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
              <Divider />
              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDoctors(department.name)}
                >
                  View Doctors
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Departments; 