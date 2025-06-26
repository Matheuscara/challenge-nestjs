import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Challenge API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => expect(body.status).toBe('ok'));
  });

  it('/statistics (GET)', () => {
    return request(app.getHttpServer())
      .get('/statistics')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('count');
        expect(body).toHaveProperty('sum');
      });
  });

  describe('/transactions flow', () => {
    const server = () => app.getHttpServer();
    const dto = () => ({
      amount: 10.5,
      timestamp: new Date().toISOString(),
    });

    it('POST → 201', async () => {
      await request(server()).post('/transactions').send(dto()).expect(201);
    });

    it('DELETE → 200', async () => {
      await request(server()).delete('/transactions').expect(200);
    });
  });
});
