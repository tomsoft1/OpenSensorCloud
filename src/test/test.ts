// // Unit tests
// import { expect } from 'chai';
// import supertest from 'supertest';

// describe('Save Record Use Case', () => {
//     const app = require('./app'); // Import the Express app for testing
//     const request = supertest(app);
  
//     it('should save a record', async () => {
//       const response = await request
//         .post('/records')
//         .send({ timestamp: new Date(), data: 'Test Data' });
  
//       expect(response.status).to.equal(201);
//       expect(response.body).to.have.property('timestamp');
//       expect(response.body).to.have.property('data');
//     });
//   });
  
  