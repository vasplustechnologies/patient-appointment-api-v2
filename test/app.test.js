const request = require('supertest');
const app = require('../server');

describe('Patient Appointment API', () => {
  beforeEach(() => {
    // Reset appointments before each test
    require('../server').appointments = [];
    require('../server').appointmentId = 1;
  });

  describe('GET /health', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('GET /appointments', () => {
    it('should return empty appointments array initially', async () => {
      const response = await request(app).get('/appointments');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('POST /appointments', () => {
    it('should create a new appointment', async () => {
      const appointmentData = {
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        date: '2024-01-15',
        time: '10:00 AM'
      };

      const response = await request(app)
        .post('/appointments')
        .send(appointmentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patientName).toBe('John Doe');
      expect(response.body.data.doctorName).toBe('Dr. Smith');
      expect(response.body.data.status).toBe('scheduled');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/appointments')
        .send({ patientName: 'John Doe' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /appointments/:id', () => {
    it('should return a specific appointment', async () => {
      // First create an appointment
      const appointmentData = {
        patientName: 'Jane Doe',
        doctorName: 'Dr. Johnson',
        date: '2024-01-16',
        time: '2:00 PM'
      };

      const createResponse = await request(app)
        .post('/appointments')
        .send(appointmentData);

      const appointmentId = createResponse.body.data.id;

      // Then retrieve it
      const getResponse = await request(app).get(/appointments/);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data.patientName).toBe('Jane Doe');
    });

    it('should return 404 for non-existent appointment', async () => {
      const response = await request(app).get('/appointments/999');
      expect(response.status).toBe(404);
    });
  });
});
