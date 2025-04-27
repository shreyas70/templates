import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import {
  PeopleAlt as PatientsIcon,
  LocalHospital as DoctorsIcon,
  Event as AppointmentsIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';

// SAMPLE DATA - Replace with your actual data from API or state management
// This is placeholder data for demonstration purposes only

// Sample statistics data - customize based on your application metrics
const statsData = [
  { title: 'Total Patients', value: '1,245', icon: <PatientsIcon fontSize="large" color="primary" /> },
  { title: 'Doctors', value: '36', icon: <DoctorsIcon fontSize="large" color="secondary" /> },
  { title: 'Appointments Today', value: '48', icon: <AppointmentsIcon fontSize="large" color="info" /> },
  { title: 'Monthly Revenue', value: '$52,489', icon: <RevenueIcon fontSize="large" color="success" /> },
];

// Sample patient data - replace with your actual data model
const recentPatients = [
  { id: 'P001', name: 'John Smith', age: 45, date: '2023-05-10', diagnosis: 'Hypertension' },
  { id: 'P002', name: 'Sarah Johnson', age: 32, date: '2023-05-09', diagnosis: 'Migraine' },
  { id: 'P003', name: 'Michael Brown', age: 58, date: '2023-05-09', diagnosis: 'Diabetes Type 2' },
  { id: 'P004', name: 'Emily Davis', age: 27, date: '2023-05-08', diagnosis: 'Anxiety' },
];

// Sample appointment data - replace with your actual data model
const upcomingAppointments = [
  { id: 'A001', patient: 'Robert Wilson', doctor: 'Dr. Jessica Adams', time: '09:00 AM', date: '2023-05-11' },
  { id: 'A002', patient: 'Lisa Thompson', doctor: 'Dr. Mark Johnson', time: '10:30 AM', date: '2023-05-11' },
  { id: 'A003', patient: 'David Miller', doctor: 'Dr. Sarah Lee', time: '02:15 PM', date: '2023-05-11' },
  { id: 'A004', patient: 'Jennifer Clark', doctor: 'Dr. James Wilson', time: '04:00 PM', date: '2023-05-11' },
];

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" variant="subtitle2">
                  {stat.title}
                </Typography>
                {stat.icon}
              </Box>
              <Typography component="p" variant="h4" sx={{ mt: 2 }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Patients */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader title="Recent Patients" />
            <Divider />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Age</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Diagnosis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td style={{ padding: '8px' }}>{patient.id}</td>
                        <td style={{ padding: '8px' }}>{patient.name}</td>
                        <td style={{ padding: '8px' }}>{patient.age}</td>
                        <td style={{ padding: '8px' }}>{patient.date}</td>
                        <td style={{ padding: '8px' }}>{patient.diagnosis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader title="Upcoming Appointments" />
            <Divider />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Patient</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Doctor</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Time</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td style={{ padding: '8px' }}>{appointment.id}</td>
                        <td style={{ padding: '8px' }}>{appointment.patient}</td>
                        <td style={{ padding: '8px' }}>{appointment.doctor}</td>
                        <td style={{ padding: '8px' }}>{appointment.time}</td>
                        <td style={{ padding: '8px' }}>{appointment.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
