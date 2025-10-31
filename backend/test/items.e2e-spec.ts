import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from '../src/items/items.module';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ItemType } from '../src/items/schemas/item.schema';

describe('Items (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(
          process.env.MONGODB_URL ||
            'mongodb://root:root@localhost:27017/shopping_cart_app_test?authSource=admin',
        ),
        AuthModule,
        ItemsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    // Get auth token
    const authResponse = await request(app.getHttpServer())
      .post('/api/auth/token')
      .expect(200);
    authToken = authResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/items (POST)', () => {
    it('should create a product item', () => {
      return request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: ItemType.PRODUCT,
          name: 'Test Product',
          description: 'Test Description',
          price: 100.0,
          stock: 10,
          category: 'Test Category',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Product');
          expect(res.body.type).toBe(ItemType.PRODUCT);
        });
    });

    it('should create an event item', () => {
      return request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: ItemType.EVENT,
          name: 'Test Event',
          description: 'Test Event Description',
          price: 50.0,
          stock: 100,
          eventDate: '2024-12-25',
          location: 'Test Location',
          capacity: 100,
          startTime: '09:00',
          endTime: '17:00',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Event');
          expect(res.body.type).toBe(ItemType.EVENT);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/api/items')
        .send({
          type: ItemType.PRODUCT,
          name: 'Test Product',
          price: 100.0,
          stock: 10,
        })
        .expect(401);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: ItemType.PRODUCT,
          name: '', // Invalid: empty name
          price: -10, // Invalid: negative price
          stock: 10,
        })
        .expect(400);
    });
  });

  describe('/api/items (GET)', () => {
    it('should return all items', () => {
      return request(app.getHttpServer())
        .get('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/api/items/:id (GET)', () => {
    let itemId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: ItemType.PRODUCT,
          name: 'Get Test Product',
          price: 100.0,
          stock: 10,
        });
      itemId = response.body.id;
    });

    it('should return a single item', () => {
      return request(app.getHttpServer())
        .get(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(itemId);
        });
    });

    it('should return 404 for non-existent item', () => {
      return request(app.getHttpServer())
        .get('/api/items/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/items/:id (PUT)', () => {
    let itemId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: ItemType.PRODUCT,
          name: 'Update Test Product',
          price: 100.0,
          stock: 10,
        });
      itemId = response.body.id;
    });

    it('should update an item', () => {
      return request(app.getHttpServer())
        .put(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Product Name',
          price: 150.0,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Product Name');
          expect(res.body.price).toBe(150.0);
        });
    });
  });

  describe('/api/items/:id (DELETE)', () => {
    let itemId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: ItemType.PRODUCT,
          name: 'Delete Test Product',
          price: 100.0,
          stock: 10,
        });
      itemId = response.body.id;
    });

    it('should delete an item', () => {
      return request(app.getHttpServer())
        .delete(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });
});

