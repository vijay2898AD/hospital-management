const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Prescription = require('../models/prescription.model');
const Appointment = require('../models/appointment.model');
const { auth, authorize } = require('../middleware/auth');

// Validation middleware
const validatePrescription = [
    body('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
    body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
    body('medicines').isArray().withMessage('Medicines must be an array'),
    body('medicines.*.name').notEmpty().withMessage('Medicine name is required'),
    body('medicines.*.dosage').notEmpty().withMessage('Medicine dosage is required'),
    body('medicines.*.frequency').notEmpty().withMessage('Medicine frequency is required'),
    body('medicines.*.duration').notEmpty().withMessage('Medicine duration is required')
];

// Create prescription (doctor only)
router.post('/', auth, authorize('doctor'), validatePrescription, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { appointmentId, diagnosis, medicines, tests, notes, followUpDate } = req.body;

        // Check if appointment exists and belongs to the doctor
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctorId: req.user._id,
            status: 'completed'
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or not completed' });
        }

        // Create prescription
        const prescription = new Prescription({
            appointmentId,
            patientId: appointment.patientId,
            doctorId: req.user._id,
            diagnosis,
            medicines,
            tests,
            notes,
            followUpDate
        });

        await prescription.save();
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get patient's prescriptions
router.get('/patient', auth, authorize('patient'), async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patientId: req.user._id })
            .populate('doctorId', 'specialization department')
            .sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get doctor's prescriptions
router.get('/doctor', auth, authorize('doctor'), async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctorId: req.user._id })
            .populate('patientId', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get prescription by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patientId', 'name email phone')
            .populate('doctorId', 'specialization department');

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Check if user has permission to view
        if (req.user.role === 'patient' && prescription.patientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this prescription' });
        }

        if (req.user.role === 'doctor' && prescription.doctorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this prescription' });
        }

        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update prescription status
router.patch('/:id/status', auth, authorize('doctor'), async (req, res) => {
    try {
        const { status } = req.body;
        const prescription = await Prescription.findOne({
            _id: req.params.id,
            doctorId: req.user._id
        });

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        prescription.status = status;
        await prescription.save();

        res.json({ message: 'Prescription status updated successfully', prescription });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get prescription statistics (admin only)
router.get('/stats/overview', auth, authorize('admin'), async (req, res) => {
    try {
        const stats = await Promise.all([
            Prescription.countDocuments({ status: 'active' }),
            Prescription.countDocuments({ status: 'completed' }),
            Prescription.countDocuments({ status: 'cancelled' })
        ]);

        res.json({
            activePrescriptions: stats[0],
            completedPrescriptions: stats[1],
            cancelledPrescriptions: stats[2]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 