import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  LocalHospital,
  School,
  Language,
  Star,
  Schedule,
  Phone,
  Email,
  EmojiEvents,
  AccessTime,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Doctors = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(location.state?.department || '');
  const [departments, setDepartments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/doctors');
        console.log('Fetched doctors:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setDoctors(response.data);
          // If we have a department from navigation state, filter immediately
          if (location.state?.department) {
            setFilteredDoctors(response.data.filter(
              doctor => doctor.department === location.state.department
            ));
          } else {
            setFilteredDoctors(response.data);
          }
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to fetch doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        if (response.data && Array.isArray(response.data)) {
          setDepartments(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    fetchDoctors();
    fetchDepartments();
  }, [location.state?.department]);

  useEffect(() => {
    let filtered = [...doctors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.userId?.name?.toLowerCase().includes(query) ||
        doctor.specialization?.toLowerCase().includes(query) ||
        doctor.department?.toLowerCase().includes(query)
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(doctor => doctor.department === selectedDepartment);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, selectedDepartment, doctors]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    // Update the URL state without full page reload
    navigate('/doctors', { 
      state: { department }, 
      replace: true 
    });
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const handleBookAppointment = (doctorId) => {
    navigate('/appointments', { state: { doctorId } });
  };

  const defaultDoctorImage = 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Our Expert Doctors
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Our Expert Doctors
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Expert Doctors
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find and book appointments with our experienced medical professionals
      </Typography>

      {/* Search and Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search doctors"
            placeholder="Search by name, specialization, or department"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchQuery && (
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <CloseIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Doctors Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : filteredDoctors.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              No doctors found matching your criteria. Please try a different search or filter.
            </Alert>
          </Grid>
        ) : (
          filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
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
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      mr: 2,
                      objectFit: 'cover',
                    }}
                    src={doctor.profilePhoto || doctor.userId?.profilePhoto || defaultDoctorImage}
                    alt={doctor.name || 'Doctor'}
                    onError={(e) => {
                      e.target.src = defaultDoctorImage;
                    }}
                  />
                  <Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {doctor.name || 'Dr. ' + doctor.userId?.name || 'Doctor Name'}
                    </Typography>
                    <Typography variant="subtitle2" color="primary">
                      {doctor.specialization}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {doctor.department}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Experience
                    </Typography>
                    <Typography variant="body1">
                      {doctor.experience} years
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Consultation Fee
                    </Typography>
                    <Typography variant="body1" color="primary.main">
                      ₹{doctor.consultationFee}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={doctor.ratings?.overall || 0} 
                      readOnly 
                      size="small" 
                      precision={0.5}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({doctor.ratings?.totalReviews || 0} reviews)
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 2, gap: 1 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    color="primary"
                    onClick={() => handleViewDetails(doctor)}
                  >
                    View Details
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleBookAppointment(doctor._id)}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Doctor Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selectedDoctor && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedDoctor.userId?.name}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={selectedDoctor.profilePhoto || selectedDoctor.userId?.profilePhoto || defaultDoctorImage}
                      alt={selectedDoctor.userId?.name}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Rating value={selectedDoctor.ratings?.overall || 0} readOnly precision={0.5} />
                      <Typography variant="body2" color="text.secondary">
                        {selectedDoctor.ratings?.totalReviews || 0} patient reviews
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {selectedDoctor.specialization}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedDoctor.bio || `Experienced ${selectedDoctor.specialization} specialist with ${selectedDoctor.experience} years of practice.`}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Speciality
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedDoctor.specialityDescription || selectedDoctor.specialization}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Experience</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedDoctor.experience} years
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Consultation Fee</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{selectedDoctor.consultationFee}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Education
                    </Typography>
                    <List dense>
                      {selectedDoctor.qualifications.map((edu, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <School />
                          </ListItemIcon>
                          <ListItemText
                            primary={edu.degree}
                            secondary={`${edu.institution} (${edu.year})${edu.honors ? ` - ${edu.honors}` : ''}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Availability Schedule
                    </Typography>
                    {selectedDoctor.availabilitySchedule?.regularHours ? (
                      <List dense>
                        {Object.entries(selectedDoctor.availabilitySchedule.regularHours).map(([day, hours]) => (
                          <ListItem key={day}>
                            <ListItemIcon>
                              <Schedule />
                            </ListItemIcon>
                            <ListItemText
                              primary={day.charAt(0).toUpperCase() + day.slice(1)}
                              secondary={`Morning: ${hours.morning}, Evening: ${hours.evening}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Availability schedule not provided. Please contact the hospital for timings.
                      </Typography>
                    )}
                    {selectedDoctor.availabilitySchedule?.emergencyAvailable && (
                      <Chip 
                        label="Available for Emergency" 
                        color="error" 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Languages
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedDoctor.languages.map((lang, index) => (
                        <Chip key={index} icon={<Language />} label={lang} size="small" />
                      ))}
                    </Box>
                  </Box>

                  {selectedDoctor.achievements && selectedDoctor.achievements.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Achievements
                      </Typography>
                      <List dense>
                        {selectedDoctor.achievements.map((achievement, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <EmojiEvents />
                            </ListItemIcon>
                            <ListItemText
                              primary={achievement.title}
                              secondary={achievement.year}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {selectedDoctor.publications && selectedDoctor.publications.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Publications
                      </Typography>
                      {selectedDoctor.publications.map((pub, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {pub.title} ({pub.year})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pub.journal}
                          </Typography>
                          {pub.impact && (
                            <Typography variant="body2" color="primary">
                              {pub.impact}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleBookAppointment(selectedDoctor._id)}
              >
                Book Appointment
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Doctors;