const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending'
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  availableTimeSlots: [{
    start: String,
    end: String
  }],
  bio: {
    type: String
  },
  languages: [{
    type: String
  }],
  achievements: [{
    title: String,
    description: String,
    year: Number
  }],
  publications: [{
    title: String,
    journal: String,
    year: Number,
    link: String
  }],
  license: {
    number: String,
    expiryDate: Date
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor; 