// Application constants
// This file contains sample constants for a healthcare application
// Customize these values to match your specific domain and requirements

// User roles - modify based on your organization's structure
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor', // Or PROVIDER, PHYSICIAN, etc.
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  // Add your custom roles here
};

// Patient status options
export const PATIENT_STATUS = {
  ACTIVE: 'active',
  DISCHARGED: 'discharged',
  ADMITTED: 'admitted',
  PENDING: 'pending',
};

// Appointment status options
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  IN_PROGRESS: 'in_progress',
};

// Payment status options
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Gender options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

// Blood group options
export const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

// Provider/Doctor specialization options - customize based on your services
// These are sample specialties for a general healthcare application
export const PROVIDER_SPECIALIZATION = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'general_medicine', label: 'General Medicine' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'obstetrics_gynecology', label: 'Obstetrics & Gynecology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'urology', label: 'Urology' },
  // Add your custom specializations here
];

// Time slots for appointments (30-minute intervals)
export const TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '09:30', label: '9:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
];

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

// API endpoints - update these to match your backend API structure
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // These are sample endpoints - rename according to your domain model
  PATIENTS: '/patients', // or CLIENTS, CUSTOMERS, MEMBERS, etc.
  DOCTORS: '/doctors',   // or PROVIDERS, PHYSICIANS, SPECIALISTS, etc.
  APPOINTMENTS: '/appointments',
  BILLING: '/billing',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  // Add your custom endpoints here
};
