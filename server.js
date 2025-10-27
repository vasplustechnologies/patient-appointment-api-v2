const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory storage (for demo purposes)
let appointments = [];
let appointmentId = 1;

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running!' });
});

app.get('/appointments', (req, res) => {
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

app.post('/appointments', (req, res) => {
  const { patientName, doctorName, date, time } = req.body;

  // Simple validation
  if (!patientName || !doctorName || !date || !time) {
    return res.status(400).json({
      success: false,
      message: 'Please provide Patient Name, Doctor Name, date, and time!'
    });
  }

  const newAppointment = {
    id: appointmentId++,
    patientName,
    doctorName,
    date,
    time,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };

  appointments.push(newAppointment);

  res.status(201).json({
    success: true,
    data: newAppointment
  });
});

app.get('/appointments/:id', (req, res) => {
  const appointment = appointments.find(apt => apt.id === parseInt(req.params.id));

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found!'
    });
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

app.delete('/appointments/:id', (req, res) => {
  const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(req.params.id));

  if (appointmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found!'
    });
  }

  appointments.splice(appointmentIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Appointment deleted successfully!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log("|=========================================>");
  console.log("Patient Appointment API running on port.. " + PORT);
  console.log("Health check: http://localhost:" + PORT + "/health");
  console.log("<=========================================|");
});

module.exports = app;