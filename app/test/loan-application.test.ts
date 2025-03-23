import request from 'supertest';
import app from '../app';
import {
  CREATE_LOAN_APPLICATION_URL,
  FIND_LOAN_APPLICATION_URL,
} from '../component/loan-application/loan-application.url';

describe('Loan Application Integration Tests', () => {
  describe('POST /loan-applications', () => {
    test('should create a loan application successfully', async () => {
      const response = await request(app)
        .post(CREATE_LOAN_APPLICATION_URL)
        .send({
          customer_id: 1,
          amount: '5000',
          term_months: '12',
          annual_interest_rate: '5.5',
        });
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', true);
      expect(response.status).toBe(201);
    });
    test('should return 404 when customer is not found', async () => {
      // Make the request
      const response = await request(app)
        .post(CREATE_LOAN_APPLICATION_URL)
        .send({
          customer_id: 100,
          amount: 5000,
          term_months: 12,
          annual_interest_rate: 5.5,
        });
      expect(response.body).toHaveProperty('message', 'Customer Not Found');
    });
    test('should return 400 when validation fails', async () => {
      const response = await request(app)
        .post(CREATE_LOAN_APPLICATION_URL)
        .send({
          customer_id: 1,
        })
        .expect(400);
      expect(response.body).toHaveProperty('status', false);
    });
  });

  describe('GET /loan-applications/:id', () => {
    test('should get a loan application successfully', async () => {
      const createApplication = await request(app)
        .post(CREATE_LOAN_APPLICATION_URL)
        .send({
          customer_id: 1,
          amount: '5000',
          term_months: '12',
          annual_interest_rate: '5.5',
        });
      const response = await request(app).get(
        `${FIND_LOAN_APPLICATION_URL.replace(
          ':id',
          createApplication.body.data.data.id,
        )}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('loanApplication');
      expect(response.body.data.loanApplication).toHaveProperty(
        'id',
        createApplication.body.data.data.id,
      );
      expect(response.body.data.loanApplication).toHaveProperty('customer_id');
      expect(response.body.data.loanApplication).toHaveProperty('amount');
      expect(response.body.data.loanApplication).toHaveProperty('term_months');
      expect(response.body.data.loanApplication).toHaveProperty(
        'annual_interest_rate',
      );
      expect(response.body.data.loanApplication).toHaveProperty(
        'monthly_payment',
      );
      expect(response.body.data.loanApplication).toHaveProperty(
        'status',
        'PENDING',
      );
      expect(response.body.data.loanApplication).toHaveProperty('customer');
    });
    test('should return 404 when loan application is not found', async () => {
      const response = await request(app).get(
        `${FIND_LOAN_APPLICATION_URL.replace(':id', '9876567')}`,
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Loan Application Not Found',
      );
    });
  });
});
