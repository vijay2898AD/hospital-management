import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocalHospital,
  History,
  Assignment,
} from '@mui/icons-material';
import { format, addDays } from 'date-fns';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request details for debugging
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error response
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [viewAppointmentDialog, setViewAppointmentDialog] = useState(false);
  const [selectedViewAppointment, setSelectedViewAppointment] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?._id) {
          throw new Error('User ID not found');
        }

        console.log('Current user:', user);
        console.log('Fetching data with token:', localStorage.getItem('token'));

        const [appointmentsRes, prescriptionsRes] = await Promise.all([
          api.get('/api/patient/appointments'),
          api.get('/api/patient/prescriptions')
        ]);

        setAppointments(appointmentsRes.data);
        setPrescriptions(prescriptionsRes.data);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Failed to fetch dashboard data: ${errorMessage}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setPrescriptionDialogOpen(true);
  };

  const handleClosePrescriptionDialog = () => {
    setPrescriptionDialogOpen(false);
    setSelectedPrescription(null);
  };

  const handleViewAppointment = (appointment) => {
    if (!appointment) {
      setError('Invalid appointment data');
      return;
    }
    setSelectedViewAppointment(appointment);
    setViewAppointmentDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getAppointmentStatus = (status) => {
    switch (status) {
      case 'pending':
        return <Typography color="warning.main">Pending</Typography>;
      case 'confirmed':
        return <Typography color="success.main">Confirmed</Typography>;
      case 'completed':
        return <Typography color="info.main">Completed</Typography>;
      case 'cancelled':
        return <Typography color="error.main">Cancelled</Typography>;
      default:
        return status;
    }
  };

  const handleRebook = async (oldAppointment) => {
    try {
      setError(null);
      setSuccess(null);

      // Validate appointment data
      if (!oldAppointment) {
        setError('Invalid appointment data for rebooking');
        return;
      }

      // Log the appointment data for debugging
      console.log('Attempting to rebook appointment:', oldAppointment);

      // Validate required fields
      if (!oldAppointment.doctorId) {
        setError('Missing doctor information for rebooking');
        return;
      }

      // Create a new appointment with the same doctor and type
      const newAppointmentData = {
        doctorId: oldAppointment.doctorId,
        type: oldAppointment.type || 'General Checkup',
        symptoms: oldAppointment.symptoms || '',
        notes: `Rebooking from cancelled appointment on ${format(new Date(oldAppointment.date), 'MMM dd, yyyy')}`,
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        timeSlot: '09:00 AM',
        status: 'pending'
      };

      console.log('New appointment data:', newAppointmentData);

      // Make the API call to create a new appointment
      const response = await api.post('/api/appointments', newAppointmentData);
      console.log('Rebook response:', response.data);

      setSuccess('Appointment rebooked successfully. Please wait for confirmation.');
      
      // Refresh the appointments list
      await fetchAppointments();
      
    } catch (error) {
      console.error('Error rebooking appointment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to rebook appointment';
      setError(`Rebooking failed: ${errorMessage}. Please try again.`);
    }
  };

  const fetchAppointments = async () => {
    try {
      const appointmentsRes = await api.get('/api/patient/appointments');
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.response?.data?.message || 'Failed to fetch appointments');
    }
  };

  const renderAppointments = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Doctor</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar>
                    {appointment.doctorId?.userId?.name?.charAt(0) || 'D'}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      {appointment.doctorId?.userId?.name || 'Unknown Doctor'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {appointment.doctorId?.specialization || 'General'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {format(new Date(appointment.date), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {appointment.timeSlot}
                </Typography>
              </TableCell>
              <TableCell>{appointment.type || 'General Checkup'}</TableCell>
              <TableCell>
                <Chip
                  label={appointment.status}
                  color={getStatusColor(appointment.status)}
                  size="small"
                />
                {appointment.status === 'cancelled' && appointment.cancellationReason && (
                  <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                    Reason: {appointment.cancellationReason}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleViewAppointment(appointment)}
                  >
                    View Details
                  </Button>
                  {appointment.status === 'cancelled' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleRebook(appointment)}
                    >
                      Rebook
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Upcoming Appointments
                  </Typography>
                  <Typography variant="h5">
                    {appointments.filter(a => a.status === 'confirmed').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTime color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Appointments
                  </Typography>
                  <Typography variant="h5">
                    {appointments.filter(a => a.status === 'pending').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <History color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Past Appointments
                  </Typography>
                  <Typography variant="h5">
                    {appointments.filter(a => a.status === 'completed').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalHospital color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Prescriptions
                  </Typography>
                  <Typography variant="h5">
                    {prescriptions.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Appointments" />
          <Tab label="Prescriptions" />
        </Tabs>
      </Box>

      {/* Appointments Table */}
      {activeTab === 0 && (
        renderAppointments()
      )}

      {/* Prescriptions Table */}
      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription._id}>
                  <TableCell>
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{prescription.doctorId?.userId?.name || 'Unknown Doctor'}</TableCell>
                  <TableCell>{prescription.doctorId?.department?.name || 'N/A'}</TableCell>
                  <TableCell>{prescription.diagnosis.substring(0, 50)}...</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewPrescription(prescription)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {prescriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No prescriptions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Appointment Dialog */}
      <Dialog
        open={viewAppointmentDialog}
        onClose={() => setViewAppointmentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          {selectedViewAppointment && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Doctor:</strong> {selectedViewAppointment.doctorId?.userId?.name || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Department:</strong> {selectedViewAppointment.doctorId?.department?.name || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Specialization:</strong> {selectedViewAppointment.doctorId?.specialization || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Date:</strong> {format(new Date(selectedViewAppointment.date), 'MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Time:</strong> {selectedViewAppointment.timeSlot || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Status:</strong> 
                    <Chip
                      label={selectedViewAppointment.status}
                      color={getStatusColor(selectedViewAppointment.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Type:</strong> {selectedViewAppointment.type || 'General Checkup'}
                  </Typography>
                  {selectedViewAppointment.symptoms && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Symptoms:</strong>
                      </Typography>
                      <Typography paragraph sx={{ ml: 2 }}>
                        {selectedViewAppointment.symptoms}
                      </Typography>
                    </>
                  )}
                  {selectedViewAppointment.notes && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Notes:</strong>
                      </Typography>
                      <Typography paragraph sx={{ ml: 2 }}>
                        {selectedViewAppointment.notes}
                      </Typography>
                    </>
                  )}
                  {selectedViewAppointment.status === 'cancelled' && selectedViewAppointment.cancellationReason && (
                    <>
                      <Typography variant="subtitle1" gutterBottom color="error">
                        <strong>Cancellation Reason:</strong>
                      </Typography>
                      <Typography paragraph sx={{ ml: 2 }} color="error">
                        {selectedViewAppointment.cancellationReason}
                      </Typography>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewAppointmentDialog(false)}>Close</Button>
          {selectedViewAppointment?.status === 'cancelled' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setViewAppointmentDialog(false);
                handleRebook(selectedViewAppointment);
              }}
            >
              Rebook Appointment
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Prescription Dialog */}
      <Dialog
        open={prescriptionDialogOpen}
        onClose={handleClosePrescriptionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Date:</strong>{' '}
                {new Date(selectedPrescription.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Doctor:</strong> {selectedPrescription.doctorId?.userId?.name || 'Unknown Doctor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Department:</strong> {selectedPrescription.doctorId?.department?.name || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Diagnosis:</strong>
              </Typography>
              <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
                {selectedPrescription.diagnosis}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Prescription:</strong>
              </Typography>
              <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
                {selectedPrescription.prescription}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Notes:</strong>
              </Typography>
              <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
                {selectedPrescription.notes}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrescriptionDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;