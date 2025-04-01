const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Appointment = require('../models/appointment.model');
const Prescription = require('../models/prescription.model');

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Patient routes are working' });
});

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

// Get patient's appointments
router.get('/appointments', auth, async (req, res) => {
  try {
    console.log('Fetching appointments for patient:', req.user._id);
    console.log('User object:', req.user);
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: [
          { path: 'userId', select: 'name' },
          { path: 'department', select: 'name' }
        ]
      })
      .sort({ date: -1 });

    console.log(`Found ${appointments.length} appointments for patient ${req.user._id}`);
    console.log('Appointments:', JSON.stringify(appointments, null, 2));
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ 
      message: 'Error fetching appointments', 
      error: error.message,
      userId: req.user?._id,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get patient's prescriptions
router.get('/prescriptions', auth, async (req, res) => {
  try {
    console.log('Fetching prescriptions for patient:', req.user._id);
    console.log('User object:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    const prescriptions = await Prescription.find({ patientId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: [
          { path: 'userId', select: 'name' },
          { path: 'department', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${prescriptions.length} prescriptions for patient ${req.user._id}`);
    console.log('Prescriptions:', JSON.stringify(prescriptions, null, 2));
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({ 
      message: 'Error fetching prescriptions', 
      error: error.message,
      userId: req.user?._id,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router; 