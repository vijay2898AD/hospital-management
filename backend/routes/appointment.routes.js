const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const { auth, authorize } = require('../middleware/auth');

// Validation middleware
const validateAppointment = [
    body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    body('type').isIn(['General Checkup', 'Follow-up', 'Consultation', 'Emergency']).withMessage('Invalid appointment type'),
    body('symptoms').optional(),
    body('notes').optional()
];

// Create appointment (patient only)
router.post('/', auth, authorize('patient'), validateAppointment, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { doctorId, date, timeSlot, type, symptoms, notes } = req.body;

        // Check if doctor exists and is approved
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (!doctor.isApproved) {
            return res.status(400).json({ message: 'Doctor is not currently available for appointments' });
        }

        // Check if time slot is available
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date,
            timeSlot,
            status: { $nin: ['cancelled'] }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        // Create appointment
        const appointment = new Appointment({
            patientId: req.user._id,
            doctorId,
            date,
            timeSlot,
            type,
            symptoms: symptoms || '',
            notes: notes || '',
            status: 'pending'
        });

        await appointment.save();
        
        // Populate doctor details before sending response
        await appointment.populate([
            { path: 'doctorId', populate: { path: 'userId', select: 'name email' } },
            { path: 'patientId', select: 'name email' }
        ]);

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get appointments
router.get('/', auth, async (req, res) => {
    try {
        let appointments;
        
        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patientId: req.user._id })
                .populate({
                    path: 'doctorId',
                    populate: [
                        { 
                            path: 'userId', 
                            select: 'name email profilePhoto' 
                        },
                        { 
                            path: 'department',
                            select: 'name'
                        }
                    ]
                })
                .populate('patientId', 'name email profilePhoto')
                .sort({ date: -1 }); // Sort by date descending
        } else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: req.user._id });
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }

            appointments = await Appointment.find({ doctorId: doctor._id })
                .populate({
                    path: 'doctorId',
                    populate: [
                        { 
                            path: 'userId', 
                            select: 'name email profilePhoto' 
                        },
                        { 
                            path: 'department',
                            select: 'name'
                        }
                    ]
                })
                .populate('patientId', 'name email profilePhoto')
                .sort({ date: -1 }); // Sort by date descending
        } else {
            return res.status(403).json({ message: 'Not authorized to view appointments' });
        }

        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
});

// Get all appointments (admin only)
router.get('/all', auth, authorize('admin'), async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            })
            .populate('patientId', 'name email phone')
            .sort({ date: 1 });
        
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Cancel appointment
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const { reason } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user has permission to cancel
        if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
        }

        if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = reason;
        appointment.cancelledBy = req.user.role;
        await appointment.save();

        res.json({ message: 'Appointment cancelled successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Complete appointment (doctor only)
router.patch('/:id/complete', auth, authorize('doctor'), async (req, res) => {
    try {
        // Get the doctor document using the user ID
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            doctorId: doctor._id,
            status: 'confirmed' // Only confirmed appointments can be completed
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or not in confirmed status' });
        }

        appointment.status = 'completed';
        await appointment.save();

        // Populate the data before sending response
        await appointment.populate([
            { path: 'doctorId', populate: { path: 'userId', select: 'name email' } },
            { path: 'patientId', select: 'name email' }
        ]);

        res.json({ message: 'Appointment completed successfully', appointment });
    } catch (error) {
        console.error('Error completing appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get appointment statistics (admin only)
router.get('/stats/overview', auth, authorize('admin'), async (req, res) => {
    try {
        const stats = await Promise.all([
            Appointment.countDocuments({ status: 'pending' }),
            Appointment.countDocuments({ status: 'confirmed' }),
            Appointment.countDocuments({ status: 'completed' }),
            Appointment.countDocuments({ status: 'cancelled' }),
            Appointment.countDocuments({ type: 'emergency' }),
            Appointment.countDocuments({ type: 'regular' }),
            Appointment.countDocuments({ type: 'follow-up' })
        ]);

        res.json({
            pendingAppointments: stats[0],
            confirmedAppointments: stats[1],
            completedAppointments: stats[2],
            cancelledAppointments: stats[3],
            emergencyAppointments: stats[4],
            regularAppointments: stats[5],
            followUpAppointments: stats[6]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single appointment
router.get('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({
                path: 'doctorId',
                populate: [
                    { path: 'userId', select: 'name email' },
                    { path: 'department', select: 'name' }
                ]
            })
            .populate('patientId', 'name email');
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        res.json(appointment);
    } catch (err) {
        console.error('Error fetching appointment:', err);
        res.status(500).json({ message: 'Error fetching appointment' });
    }
});

module.exports = router; 