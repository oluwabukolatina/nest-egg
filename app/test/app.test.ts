import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../app';

describe('home', () => {
  it('appropriate message', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).toEqual(StatusCodes.OK);
        expect(res.body.message).toEqual('Welcome To Nest Egg');
        expect(res.body.status).toEqual(true);
        done();
      });
  });
});
