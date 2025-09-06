import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('Application E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return Hello World on root', async () => {
    const res = await supertest(app.getHttpServer()).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Hello');
  });

  it('should create a cat with valid data', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/cats')
      .send({ name: 'Tom', age: 3 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Tom', age: 3 });
  });

  it('should fail to create a cat with invalid data', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/cats')
      .send({ name: 123, age: 'not-a-number' });
    expect(res.status).toBe(400);
  });
});