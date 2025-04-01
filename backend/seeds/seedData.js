require('dotenv').config({ path: '../.env' });
console.log('MONGO_URI:', process.env.MONGO_URI);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Department = require('../models/department.model');

// Define departments with complete information
const departments = [
  {
    name: 'Cardiology',
    description: 'Specialized in diagnosis and treatment of heart diseases',
    specializations: ['Interventional Cardiology', 'Cardiac Electrophysiology', 'Nuclear Cardiology', 'Pediatric Cardiology'],
    services: [
      'Electrocardiogram (ECG)',
      'Echocardiogram',
      'Cardiac Catheterization',
      'Heart Surgery'
    ],
    facilities: [
      'Modern Cardiac ICU',
      'Advanced Cardiac Lab',
      'Emergency Cardiac Care'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Neurology',
    description: 'Expert care for neurological disorders and conditions',
    specializations: ['General Neurology', 'Neurosurgery', 'Pediatric Neurology', 'Stroke Medicine'],
    services: [
      'Neurological Examination',
      'EEG',
      'Brain Mapping',
      'Spine Surgery'
    ],
    facilities: [
      'Neuro ICU',
      'Advanced Imaging Center',
      '24/7 Emergency Care'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Orthopedics',
    description: 'Comprehensive care for bone and joint conditions',
    specializations: ['Joint Replacement', 'Spine Surgery', 'Sports Medicine', 'Pediatric Orthopedics'],
    services: [
      'Joint Replacement',
      'Spine Surgery',
      'Sports Medicine',
      'Trauma Care'
    ],
    facilities: [
      'Modern Operation Theaters',
      'Rehabilitation Center',
      'Physical Therapy Unit'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Pediatrics',
    description: 'Specialized medical care for infants, children, and adolescents',
    specializations: ['General Pediatrics', 'Neonatology', 'Pediatric Surgery', 'Pediatric Oncology'],
    services: [
      'Well-child Check-ups',
      'Vaccinations',
      'Pediatric Surgery',
      'Neonatal Care'
    ],
    facilities: [
      'Child-friendly Wards',
      'Neonatal ICU',
      'Pediatric Emergency Unit'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Internal Medicine',
    description: 'Comprehensive care for adult diseases and chronic conditions',
    specializations: ['General Medicine', 'Gastroenterology', 'Pulmonology', 'Endocrinology'],
    services: [
      'General Health Check-ups',
      'Disease Management',
      'Preventive Care',
      'Chronic Disease Treatment'
    ],
    facilities: [
      'Modern Diagnostic Center',
      'Treatment Rooms',
      'Consultation Suites'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Surgery',
    description: 'Advanced surgical procedures and comprehensive surgical care',
    specializations: ['General Surgery', 'Vascular Surgery', 'Plastic Surgery', 'Bariatric Surgery'],
    services: [
      'Minimally Invasive Surgery',
      'Emergency Surgery',
      'Laparoscopic Procedures',
      'Post-operative Care'
    ],
    facilities: [
      'State-of-the-art OT Complex',
      'Surgical ICU',
      'Recovery Units'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Obstetrics & Gynecology',
    description: "Complete women's healthcare services and maternity care",
    specializations: ['General Gynecology', 'Maternal-Fetal Medicine', 'Reproductive Medicine', 'Gynecologic Oncology'],
    services: [
      'Prenatal Care',
      'Delivery Services',
      'Gynecologic Surgery',
      'Fertility Treatment'
    ],
    facilities: [
      'Labor and Delivery Unit',
      'Maternity Ward',
      'Neonatal Care Unit'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Psychiatry',
    description: 'Mental health care and psychological support services',
    specializations: ['Adult Psychiatry', 'Child Psychiatry', 'Addiction Psychiatry', 'Geriatric Psychiatry'],
    services: [
      'Psychiatric Evaluation',
      'Counseling Services',
      'Addiction Treatment',
      'Group Therapy'
    ],
    facilities: [
      'Counseling Rooms',
      'Day Care Center',
      'Rehabilitation Unit'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Dermatology',
    description: 'Comprehensive skin care and dermatological treatments',
    specializations: ['Medical Dermatology', 'Cosmetic Dermatology', 'Pediatric Dermatology', 'Dermatologic Surgery'],
    services: [
      'Skin Disease Treatment',
      'Cosmetic Procedures',
      'Laser Therapy',
      'Skin Cancer Screening'
    ],
    facilities: [
      'Modern Dermatology Suite',
      'Laser Treatment Room',
      'Procedure Rooms'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Ophthalmology',
    description: 'Complete eye care and vision correction services',
    specializations: ['Cornea and External Disease', 'Glaucoma', 'Retina', 'Pediatric Ophthalmology'],
    services: [
      'Eye Examinations',
      'Vision Correction',
      'Cataract Surgery',
      'Glaucoma Treatment'
    ],
    facilities: [
      'Eye Testing Units',
      'Operation Theater',
      'Vision Care Center'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'ENT',
    description: 'Specialized care for ear, nose, throat, and related conditions',
    specializations: ['Otology', 'Rhinology', 'Laryngology', 'Head and Neck Surgery'],
    services: [
      'Hearing Tests',
      'Sinus Treatment',
      'Voice Disorders',
      'Sleep Apnea Care'
    ],
    facilities: [
      'Audiology Lab',
      'ENT Surgery Suite',
      'Speech Therapy Unit'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  },
  {
    name: 'Oncology',
    description: 'Comprehensive cancer care and treatment services',
    specializations: ['Medical Oncology', 'Radiation Oncology', 'Surgical Oncology', 'Hematology'],
    services: [
      'Cancer Screening',
      'Chemotherapy',
      'Radiation Therapy',
      'Cancer Surgery'
    ],
    facilities: [
      'Cancer Care Center',
      'Radiation Unit',
      'Chemotherapy Suite'
    ],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed (Emergency Only)'
    },
    status: 'active'
  }
];

// Management roles
const managementRoles = [
  {
    name: 'Dr. Prabhakar',
    role: 'Hospital Director',
    email: 'director@Colgatehospital.com',
    password: 'director123',
    phone: '+91 7890123456',
    bio: 'Over 32 years of healthcare management experience'
  },
  {
    name: 'Dr. Vamshi',
    role: 'Medical Director',
    email: 'medical.director@Colgatehospital.com',
    password: 'medical123',
    phone: '+91 8092134567',
    bio: 'Former head of Surgery department with 20 years experience'
  },
  {
    name: 'Mr. Krupa Rani',
    role: 'Administrative Director',
    email: 'admin.director@Colgatehospital.com',
    password: 'admin123',
    phone: '+91 9017357437',
    bio: 'MBA in Healthcare Management with 15 years experience'
  },
  {
    name: 'Dr. Gayatri',
    role: 'Chief of Medical Staff',
    email: 'cms@Colgatehospital.com',
    password: 'cms123',
    phone: '+91 4276327280',
    bio: 'Distinguished physician with over 18 years of clinical excellence'
  },
  {
    name: 'Super Admin',
    role: 'Super Admin',
    email: 'superadmin@Colgatehospital.com',
    password: 'superadmin123',
    phone: '+91 7908654321',
    bio: 'System administrator with full access control'
  }
];

// Add profile photo URLs based on gender
const profilePhotos = {
  male: [
    'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg',
    'https://img.freepik.com/free-photo/young-male-doctor-wearing-white-coat-stethoscope-isolated_662251-336.jpg',
    'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg',
    'https://img.freepik.com/free-photo/pleased-young-male-doctor-wearing-medical-robe-stethoscope-glasses-showing-empty-hand-isolated-white-wall_141793-41234.jpg'
  ],
  female: [
    'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
    'https://img.freepik.com/free-photo/portrait-smiling-young-woman-doctor-healthcare-medical-worker-pointing-fingers-left-showing-clinic-advertisement_1258-88108.jpg',
    'https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg',
    'https://img.freepik.com/free-photo/front-view-female-doctor-with-medical-mask-posing-with-crossed-arms_23-2148445082.jpg'
  ]
};

// Add detailed specialization descriptions
const specializationDetails = {
  'Interventional Cardiology': 'Specializes in catheter-based treatment of heart diseases using advanced imaging and technology.',
  'Cardiac Electrophysiology': 'Focuses on diagnosing and treating heart rhythm disorders using advanced electrical mapping.',
  'Nuclear Cardiology': 'Utilizes radioactive materials to diagnose and assess various heart conditions.',
  'Pediatric Cardiology': 'Specializes in diagnosing and treating heart problems in children.',
  // ... add descriptions for all specializations
};

// Add medical education institutions with details
const medicalInstitutions = [
  {
    name: 'Institute of Medicine, Tribhuvan University',
    location: 'Kathmandu, Nepal',
    ranking: 'Top medical institution in Nepal'
  },
  {
    name: 'AIIMS, New Delhi',
    location: 'New Delhi, India',
    ranking: 'Premier medical institute in South Asia'
  },
  {
    name: 'CMC Vellore',
    location: 'Tamil Nadu, India',
    ranking: 'Leading medical college in India'
  },
  {
    name: 'BPKIHS',
    location: 'Dharan, Nepal',
    ranking: 'Renowned medical institution in Eastern Nepal'
  }
];

// Generate exactly 50 doctors distributed across departments
const generateDoctors = () => {
  const doctors = [];
  const usedEmails = new Set();
  const nepaliFamilyNames = ['Sharma', 'Adhikari', 'Poudel', 'Karki', 'Gurung', 'Thapa', 'KC', 'Shrestha', 'Basnet', 'Rai'];
  const maleFirstNames = ['Aarav', 'Arjun', 'Bishnu', 'Dev', 'Gagan', 'Hari', 'Ishwar', 'Kiran', 'Mohan', 'Nabin'];
  const femaleFirstNames = ['Uma', 'Priya', 'Sita', 'Gita', 'Maya', 'Diya', 'Asha', 'Binita', 'Deepa', 'Kavita'];

  // Create a list of all department-specialization combinations
  const allSpecializations = departments.flatMap(dept => 
    dept.specializations ? dept.specializations.map(spec => ({
      department: dept.name,
      specialization: spec
    })) : []
  );

  // Ensure at least one doctor per specialization if possible
  const doctorsToCreate = 50;
  let remainingDoctors = doctorsToCreate;

  // Function to create a single doctor
  const createDoctor = (department, specialization) => {
    let firstName, lastName, email, gender;
    
    do {
      gender = Math.random() > 0.5 ? 'male' : 'female';
      firstName = gender === 'male'
        ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
        : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
      lastName = nepaliFamilyNames[Math.floor(Math.random() * nepaliFamilyNames.length)];
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@Colgatehospital.com`;
    } while (usedEmails.has(email));
    
    usedEmails.add(email);
    
    const experience = Math.floor(Math.random() * 15) + 5; // 5-20 years experience
    const institution = medicalInstitutions[Math.floor(Math.random() * medicalInstitutions.length)];
    
    return {
      name: `${firstName} ${lastName}`,
      email: email,
      gender: gender,
      profilePhoto: profilePhotos[gender][Math.floor(Math.random() * profilePhotos[gender].length)],
      specialization: specialization,
      department: department,
      experience: experience,
      education: [
        {
          degree: 'MBBS',
          institution: institution.name,
          location: institution.location,
          year: 2023 - experience - 5,
          honors: Math.random() > 0.5 ? 'Gold Medalist' : null
        },
        {
          degree: `MD ${specialization}`,
          institution: institution.name,
          location: institution.location,
          year: 2023 - experience,
          honors: Math.random() > 0.3 ? 'Distinction' : null
        }
      ],
      languages: ['English', 'Nepali'].concat(Math.random() > 0.5 ? ['Hindi'] : []),
      bio: `Experienced ${specialization.toLowerCase()} specialist with ${experience} years of dedicated practice in ${department}. Committed to providing exceptional patient care.`,
      consultationFee: Math.floor(Math.random() * 1500) + 1000,
      achievements: [
        {
          title: 'Telugu Medical Excellence Award',
          year: 2023 - Math.floor(Math.random() * 5)
        }
      ],
      availabilitySchedule: {
        regularHours: {
          monday: { morning: '9:00 AM - 1:00 PM', evening: '4:00 PM - 7:00 PM' },
          tuesday: { morning: '9:00 AM - 1:00 PM', evening: '4:00 PM - 7:00 PM' },
          wednesday: { morning: '9:00 AM - 1:00 PM', evening: '4:00 PM - 7:00 PM' },
          thursday: { morning: '9:00 AM - 1:00 PM', evening: '4:00 PM - 7:00 PM' },
          friday: { morning: '9:00 AM - 1:00 PM', evening: '4:00 PM - 7:00 PM' }
        },
        emergencyAvailable: Math.random() > 0.5
      },
      ratings: {
        overall: (4 + Math.random()).toFixed(1),
        totalReviews: Math.floor(Math.random() * 100) + 20
      }
    };
  };

  // Distribute doctors across specializations
  while (doctors.length < doctorsToCreate && allSpecializations.length > 0) {
    const randomIndex = Math.floor(Math.random() * allSpecializations.length);
    const { department, specialization } = allSpecializations[randomIndex];
    
    doctors.push(createDoctor(department, specialization));
    
    // Remove the specialization if we've added enough doctors for it
    if (doctors.filter(d => d.specialization === specialization).length >= 3) {
      allSpecializations.splice(randomIndex, 1);
    }
  }

  return doctors;
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');

    console.log('Dropping existing collections...');
    const collections = ['users', 'doctors', 'departments'];
    for (const collection of collections) {
      try {
        await mongoose.connection.db.dropCollection(collection);
        console.log(`Dropped ${collection} collection`);
      } catch (err) {
        if (err.code === 26) {
          console.log(`Collection ${collection} does not exist, skipping...`);
        } else {
          console.error(`Error dropping ${collection}:`, err);
        }
      }
    }

    // Create management users
    console.log('Creating management users...');
    for (const adminData of managementRoles) {
      await User.create({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
        role: 'admin',
        phone: adminData.phone,
        bio: adminData.bio
      });
      console.log(`Created admin user: ${adminData.name} (${adminData.role})`);
    }

    // Create departments
    console.log('Creating departments...');
    const createdDepartments = await Department.create(departments);
    console.log(`Created ${createdDepartments.length} departments`);

    // Create doctors
    console.log('Creating doctor accounts...');
    const doctorsData = generateDoctors();
    let createdDoctors = 0;

    for (const doctorData of doctorsData) {
      const user = await User.create({
        name: doctorData.name,
        email: doctorData.email,
        password: 'doctor123',
        role: 'doctor',
        phone: '+977-98' + Math.floor(10000000 + Math.random() * 90000000),
        profilePhoto: doctorData.profilePhoto,
        gender: doctorData.gender
      });

      await Doctor.create({
        userId: user._id,
        department: doctorData.department,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        qualifications: doctorData.education,
        consultationFee: doctorData.consultationFee,
        availabilitySchedule: doctorData.availabilitySchedule,
        bio: doctorData.bio,
        languages: doctorData.languages,
        achievements: doctorData.achievements,
        ratings: doctorData.ratings,
        isApproved: true
      });

      createdDoctors++;
      if (createdDoctors % 10 === 0) {
        console.log(`Created ${createdDoctors} doctors...`);
      }
    }

    console.log('\nDatabase seeded successfully!');
    console.log('\nManagement Credentials:');
    managementRoles.forEach(admin => {
      console.log(`\n${admin.role}:`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${admin.password}`);
    });
    
    console.log('\nDoctor credentials template:');
    console.log('Email: firstname.lastname@Colgatehospital.com');
    console.log('Password: doctor123');
    
    console.log(`\nTotal doctors created: ${createdDoctors}`);
    console.log(`Total departments created: ${departments.length}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed script
seedDatabase();