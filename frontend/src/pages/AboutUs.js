import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LocalHospital as LocalHospitalIcon,
  Groups as GroupsIcon,
  EmojiEvents as EmojiEventsIcon,
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  MedicalServices as MedicalServicesIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Healing as HealingIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const AboutUs = () => {
  const features = [
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
      title: 'State-of-the-Art Facilities',
      description: 'Modern medical equipment and comfortable patient care environment with advanced diagnostic and treatment facilities.',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: 'Expert Medical Team',
      description: 'Highly qualified doctors and healthcare professionals with extensive experience in their respective fields.',
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: 'Quality Care',
      description: 'Committed to providing the highest standard of healthcare services with a patient-centric approach.',
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Technology',
      description: 'Utilizing cutting-edge medical technology and treatments to ensure the best possible outcomes.',
    },
  ];

  const managementTeam = [

      {
        name: 'Dr. Prabhakar',
        position: 'Chief Executive Officer',
        description: 'Leading the hospital with over 21 years of healthcare management experience.',
        image: '/images/management/Prabhakar.jpg',
      },
      {
        name: 'Dr. Vamshi',
        position: 'Chief Operations Officer',
        description: 'Ensuring hospital operations run smoothly with expertise in healthcare logistics.',
        image: '/images/management/Vamshi.jpg',
      },
      {
        name: 'Dr. krupa rani',
        position: 'Chief Financial Officer',
        description: 'Managing hospital finances with over a decade of experience in healthcare budgeting.',
        image: '/images/management/Krupa.jpg',
      },
      {
        name: 'Dr. Gayatri',
        position: 'Chief Medical Officer',
        description: 'Supervising medical staff and fostering excellent patient care practices.',
        image: '/images/management/Gayatri.jpg',
      },
      {
        name: 'Ms. Sameera Rani',
        position: 'Chief Nursing Officer',
        description: 'Leading the nursing team to provide quality patient care services.',
        image: '/images/management/Sameera.jpg',
      },

      {
        name: 'Mr. Anil kumar',
        position: 'Administrative Director',
        description: 'Overseeing non-medical operations and ensuring administrative processes align with the hospital’s goals.',
        image: '/images/management/Anil.jpg',
      },
      
      {
        name: 'Mr. Sowrayanga',
        position: 'Hospital Administrator',
        description: 'Overseeing daily administrative tasks to ensure seamless operations.',
        image: '/images/management/Sow.jpg',
      },
      {
        name: 'Ms. Annie veronica',
        position: 'Director of Human Resources',
        description: 'Managing recruitment and staff relations to foster a healthy work environment.',
        image: '/images/management/Ann.jpg',
      },
      {
        name: 'Dr. Sharon rinnah',
        position: 'Director of Patient Services',
        description: 'Ensuring patient satisfaction through streamlined service delivery.',
        image: '/images/management/sha.jpg',
      },
      {
        name: 'Mr. Jonathan',
        position: 'Director of Marketing and Public Relations',
        description: 'Promoting hospital services and managing its public image effectively.',
        image: '/images/management/John.jpg',
      },
  ];

  const achievements = [
    'ISO 9001:2015 Certified Healthcare Institution',
    'Best Hospital Award 2022 - Andhra province',
    'Excellence in Patient Care - Ministry of Health Recognition',
    'Zero Medical Error Achievement 2020',
    'Community Service Excellence Award',
  ];

  const facilities = [
    'Emergency Department (24/7)',
    'Intensive Care Unit (ICU)',
    'Operation Theaters',
    'Diagnostic Imaging Center',
    'Pathology Laboratory',
    'Pharmacy Services',
    'Specialized Clinics',
    'Rehabilitation Center',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Colgate hospital’s
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Providing Quality Healthcare Services Since 2005
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
          Located in the heart of Visakhapatnam, Colgate hospital’s has been serving the community
          with dedication and excellence. Our commitment to healthcare innovation and patient
          satisfaction has made us one of the leading healthcare institutions in Andhra Province.
        </Typography>
      </Box>

      {/* Mission and Vision */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Our Mission
            </Typography>
            <Typography paragraph>
              To provide exceptional healthcare services with compassion and dedication,
              ensuring the well-being of our patients and the community we serve in
              Vizag and surrounding areas. We strive to make quality healthcare
              accessible to all while maintaining the highest standards of medical practice.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Our Vision
            </Typography>
            <Typography paragraph>
              To be the leading healthcare institution in Andhra Province, recognized for excellence in
              patient care, medical innovation, and community health improvement. We aim to set
              new standards in healthcare delivery and become a center of excellence for
              medical education and research.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Core Values */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Core Values
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <HealingIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" gutterBottom align="center">
                  Compassion
                </Typography>
                <Typography variant="body2" align="center">
                  Treating every patient with care and empathy
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <CheckCircleIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" gutterBottom align="center">
                  Excellence
                </Typography>
                <Typography variant="body2" align="center">
                  Striving for the highest standards in healthcare
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <PsychologyIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" gutterBottom align="center">
                  Innovation
                </Typography>
                <Typography variant="body2" align="center">
                  Embracing new technologies and methods
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" gutterBottom align="center">
                  Education
                </Typography>
                <Typography variant="body2" align="center">
                  Continuous learning and development
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Management Team */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Management Team
        </Typography>
        <Grid container spacing={4}>
          {managementTeam.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                      alt={member.name}
                      src={member.image}
                    />
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Facilities */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Facilities
        </Typography>
        <Grid container spacing={2}>
          {facilities.map((facility, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MedicalServicesIcon color="primary" />
                  <Typography variant="body1">{facility}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Achievements */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Achievements
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <List>
            {achievements.map((achievement, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEventsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={achievement} />
                </ListItem>
                {index < achievements.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* History Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Journey
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TimelineIcon color="primary" sx={{ mt: 1 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    2005 - Foundation
                  </Typography>
                  <Typography paragraph>
                    Established as a small community clinic with basic healthcare services
                    in Vizag, serving the local community with dedication.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TimelineIcon color="primary" sx={{ mt: 1 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    2010 - Expansion
                  </Typography>
                  <Typography paragraph>
                    Major expansion with addition of specialized departments, modern
                    equipment, and increased bed capacity.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TimelineIcon color="primary" sx={{ mt: 1 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    2017 - Modernization
                  </Typography>
                  <Typography paragraph>
                    Complete hospital modernization with state-of-the-art medical
                    technology and enhanced patient care facilities.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TimelineIcon color="primary" sx={{ mt: 1 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    2020 - Excellence Center
                  </Typography>
                  <Typography paragraph>
                    Recognized as a center of excellence in healthcare, serving as a
                    model institution in Andhra Province.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Features */}
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Why Choose Us
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AboutUs; 