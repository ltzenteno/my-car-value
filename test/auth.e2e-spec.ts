import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const expectedEmail = 'test@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: expectedEmail,
        password: 'secret'
      })
      .expect(201)
      .then((response: request.Response) => {
        const { id, email } = response.body;

        expect(id).toBeDefined();
        expect(email).toEqual(expectedEmail);
      })
  });

  it('signup as a new user then get the logged user (whoami)', async () => {
    const email = 'test@test.com';

    // creating user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email,
        password: 'secret'
      })
      .expect(201);

      // sign-in
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: email,
        password: 'secret'
      })
      .expect(200);

    // superagent by default does not handle cookies for us
    // we need to temporarily store it manually
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami/')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
