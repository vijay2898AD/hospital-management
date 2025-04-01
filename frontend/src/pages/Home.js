import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
} from "@mui/material";
import {
  LocalHospital,
  People,
  AccessTime,
  MedicalServices,
  CalendarToday,
  Assignment,
  History,
  Star,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const features = [
  {
    icon: <LocalHospital fontSize="large" />,
    title: "Modern Facilities",
    description:
      "State-of-the-art medical equipment and comfortable patient rooms.",
  },
  {
    icon: <People fontSize="large" />,
    title: "Expert Doctors",
    description: "Highly qualified and experienced medical professionals.",
  },
  {
    icon: <AccessTime fontSize="large" />,
    title: "24/7 Service",
    description: "Round-the-clock emergency and medical services.",
  },
  {
    icon: <MedicalServices fontSize="large" />,
    title: "Comprehensive Care",
    description: "Wide range of medical specialties and treatment options.",
  },
];

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleNavigation = () => {
      if (user) {
        switch (user.role) {
          case "doctor":
            navigate("/doctor/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "patient":
            navigate("/patient/dashboard");
            break;
          default:
            break;
        }
      }
    };

    handleNavigation();
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        try {
          const response = await axios.get("process.env.REACT_APP_API_URL/api/doctors");
          setDoctors(response.data);
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBookAppointment = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/appointments/book");
    }
  };

  // If user is logged in, don't render anything as they will be redirected
  if (user) {
    return null;
  }

  // If still loading, show loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const renderUserDashboard = () => (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Your Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarToday color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Upcoming Appointments</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {
                    userAppointments.filter(
                      (apt) => new Date(apt.date) > new Date()
                    ).length
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Assignment color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Prescriptions</Typography>
                </Box>
                <Typography variant="h4" color="secondary">
                  {prescriptions.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <History color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Past Appointments</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {
                    userAppointments.filter(
                      (apt) => new Date(apt.date) < new Date()
                    ).length
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleBookAppointment}
        sx={{ mb: 4 }}
      >
        Book New Appointment
      </Button>
    </Box>
  );

  const renderHospitalInfo = () => (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="About Us" />
        <Tab label="Our Doctors" />
        <Tab label="Services" />
        <Tab label="Management" />
      </Tabs>

      {activeTab === 0 && (
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            About Cologate Hospital's
          </Typography>
          <Typography paragraph>
            Established in 2005, Colgate Hospital's has been at the
            forefront of medical excellence and patient care in Andhra. Our
            state-of-the-art facility spans over 50,000 square feet and houses
            the latest medical technology and equipment.
          </Typography>
          <Typography paragraph>
            We are committed to providing comprehensive healthcare services with
            compassion and excellence. Our team of experienced medical
            professionals works tirelessly to ensure the highest standards of
            patient care and safety.
          </Typography>
          <Box sx={{ my: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Our Mission
                  </Typography>
                  <Typography>
                    To provide accessible, high-quality healthcare services to
                    all members of our community while advancing medical
                    knowledge through research and education.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Our Vision
                  </Typography>
                  <Typography>
                    To be the leading healthcare institution in India,
                    recognized for excellence in patient care, medical
                    education, and research.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}

      {activeTab === 1 && (
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Our Expert Doctors
          </Typography>
          <Grid container spacing={3}>
            {doctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={doctor.image || ""}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{doctor.name}</Typography>
                        <Typography color="textSecondary">
                          {doctor.specialization}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {doctor.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Star sx={{ color: theme.palette.warning.main, mr: 1 }} />
                      <Typography variant="body2">
                        {doctor.rating} ({doctor.reviewCount} reviews)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {activeTab === 2 && (
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Our Services
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ color: theme.palette.primary.main, mr: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6">{feature.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {activeTab === 3 && (
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Hospital Management
          </Typography>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src="/images/management/Prabhakar.jpg"
                sx={{ width: 120, height: 120, mr: 3 }}
              />
              <Box>
                <Typography variant="h5" gutterBottom>
                  Dr. Prabhakar
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Chief Executive Officer
                </Typography>
                <Typography variant="body2">
                  Leading the hospital with over 21 years of healthcare
                  management experience.
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Management Team
          </Typography>
          <List>
            {[
              {
                name: "Dr. Vamshi",
                role: "Chief Operations Officer",
                description:
                  "Ensuring hospital operations run smoothly with expertise in healthcare logistics.",
                image: "/images/management/Vamshi.jpg",
              },
              {
                name: "Dr. Krupa Rani",
                role: "Chief Financial Officer",
                description:
                  "Managing hospital finances with over a decade of experience in healthcare budgeting.",
                image: "/images/management/Krupa.jpg",
              },
              {
                name: "Dr. Gayatri",
                role: "Chief Medical Officer",
                description:
                  "Supervising medical staff and fostering excellent patient care practices.",
                image: "/images/management/Gayatri.jpg",
              },
              {
                name: "Ms. Sameera Rani",
                role: "Chief Nursing Officer",
                description:
                  "Leading the nursing team to provide quality patient care services.",
                image: "/images/management/Sameera.jpg",
              },
              {
                name: "Mr. Anil kumar",
                role: "Administrative Director",
                description:
                  "Overseeing non-medical operations and ensuring administrative processes align with the hospital’s goals.",
                image: "/images/management/Anil.jpg",
              },
              {
                name: "Mr. Sowrayanga",
                role: "Hospital Administrator",
                description:
                  "Overseeing daily administrative tasks to ensure seamless operations.",
                image: "/images/management/Sow.jpg",
              },
              {
                name: "Ms. Annie veronica",
                role: "Director of Human Resources",
                description:
                  "Managing recruitment and staff relations to foster a healthy work environment.",
                image: "/images/management/Ann.jpg",
              },
              {
                name: "Dr. Sharon rinnah",
                role: "Director of Patient Services",
                description:
                  "Ensuring patient satisfaction through streamlined service delivery.",
                image: "/images/management/sha.jpg",
              },
              {
                name: "Mr. Jonathan",
                role: "Director of Marketing and Public Relations",
                description:
                  "Promoting hospital services and managing its public image effectively.",
                image: "/images/management/John.jpg",
              },
            ].map((member, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={member.image} alt={member.name}>
                      {!member.image && member.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="subtitle2"
                          color="primary"
                        >
                          {member.role}
                        </Typography>
                        <br />
                        {member.description}
                      </>
                    }
                  />
                </ListItem>
                {index < 2 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Container>
      )}
    </Box>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          borderRadius: { xs: 0, md: "0 0 50px 50px" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Colgate Hospital
              </Typography>
              <Typography variant="h5" gutterBottom>
                Providing quality healthcare services with compassion and
                excellence
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate("/login")}
                sx={{ mt: 4 }}
              >
                Book Appointment
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hospital.jpg"
                alt="Hospital"
                sx={{
                  width: "100%",
                  height: "400px",
                  borderRadius: 10,
                  boxShadow: 5,
                }}
                onError={(e) => {
                  e.target.src =
                    "https://source.unsplash.com/800x600/?hospital";
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {user ? renderUserDashboard() : null}
        {renderHospitalInfo()}
      </Container>
    </Box>
  );
};

export default Home;
