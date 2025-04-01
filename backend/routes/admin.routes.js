const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Appointment = require('../models/appointment.model');
const Department = require('../models/department.model');
const { auth, authorize } = require('../middleware/auth');

// Middleware to check if user is admin
const adminCheck = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};

// Apply admin check to all routes
router.use(auth);
router.use(adminCheck);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalDoctors, totalPatients, appointments] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      Appointment.find()
    ]);

    const pendingApprovals = appointments.filter(apt => apt.status === 'pending').length;

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments: appointments.length,
      pendingApprovals
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get all appointments (admin only)
router.get('/appointments', async (req, res) => {
  try {
    console.log('Fetching appointments for admin...');
    
    // Fetch all appointments with populated data
    const appointments = await Appointment.find()
      .populate({
        path: 'patientId',
        select: 'name email profilePhoto phoneNumber'
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .sort({ date: -1 })
      .lean();

    console.log(`Found ${appointments?.length || 0} appointments`);

    if (!appointments || appointments.length === 0) {
      console.log('No appointments found');
      return res.json({
        appointments: [],
        categorizedAppointments: {
          today: [],
          upcoming: [],
          past: []
        },
        stats: {
          totalAppointments: 0,
          pendingAppointments: 0,
          todayAppointments: 0,
          upcomingAppointments: 0,
          pastAppointments: 0
        }
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter appointments by date with proper date handling
    const todayAppointments = appointments.filter(apt => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });

    const upcomingAppointments = appointments.filter(apt => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate > today && apt.status !== 'completed' && apt.status !== 'cancelled';
    });

    const pastAppointments = appointments.filter(apt => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate < today || apt.status === 'completed' || apt.status === 'cancelled';
    });

    // Calculate stats
    const stats = {
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
      todayAppointments: todayAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      pastAppointments: pastAppointments.length,
      completedAppointments: appointments.filter(apt => apt.status === 'completed').length
    };

    // Log the response for debugging
    console.log('Sending appointments response:', {
      totalAppointments: appointments.length,
      todayAppointments: todayAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      pastAppointments: pastAppointments.length
    });
    
    res.json({
      appointments,
      categorizedAppointments: {
        today: todayAppointments,
        upcoming: upcomingAppointments,
        past: pastAppointments
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      message: 'Error fetching appointments',
      error: error.message 
    });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate({
        path: 'userId',
        select: 'name email profilePhoto phoneNumber'
      })
      .populate('department')
      .lean();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// Get all patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
});

// Update appointment status
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    // Validate appointment ID
    if (!id) {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow specific status transitions
    const allowedStatuses = ['confirmed', 'cancelled', 'completed', 'pending'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Require cancellation reason when cancelling
    if (status === 'cancelled' && !cancellationReason) {
      return res.status(400).json({ message: 'Cancellation reason is required' });
    }

    // Update the appointment
    appointment.status = status;
    if (status === 'cancelled') {
      appointment.cancellationReason = cancellationReason;
    }

    await appointment.save();

    // Return updated appointment with populated fields
    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email profilePhoto')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .lean();

    console.log('Appointment status updated:', {
      id: updatedAppointment._id,
      status: updatedAppointment.status
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ 
      message: 'Error updating appointment status',
      error: error.message
    });
  }
});

module.exports = router; 