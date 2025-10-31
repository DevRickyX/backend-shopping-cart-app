import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from '../src/items/items.module';
import { CartModule } from '../src/cart/cart.module';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ItemType } from '../src/items/schemas/item.schema';

describe('Cart (e2e)', () => {
  let app: INestApplication;
  let itemId: string;

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
        CartModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    // Create a test item
    const authResponse = await request(app.getHttpServer())
      .post('/api/auth/token')
      .expect(200);
    const authToken = authResponse.body.access_token;

    const itemResponse = await request(app.getHttpServer())
      .post('/api/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: ItemType.PRODUCT,
        name: 'Cart Test Product',
        description: 'Test Description',
        price: 100.0,
        stock: 10,
        category: 'Test Category',
      })
      .expect(201);
    itemId = itemResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/cart/check-stock (POST)', () => {
    it('should check stock availability - available', () => {
      return request(app.getHttpServer())
        .post('/api/cart/check-stock')
        .send({
          itemId,
          quantity: 5,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.available).toBe(true);
          expect(res.body.availableStock).toBe(10);
          expect(res.body.requestedQuantity).toBe(5);
        });
    });

    it('should check stock availability - insufficient', () => {
      return request(app.getHttpServer())
        .post('/api/cart/check-stock')
        .send({
          itemId,
          quantity: 15,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.available).toBe(false);
          expect(res.body.availableStock).toBe(10);
          expect(res.body.requestedQuantity).toBe(15);
        });
    });

    it('should return 404 for non-existent item', () => {
      return request(app.getHttpServer())
        .post('/api/cart/check-stock')
        .send({
          itemId: '507f1f77bcf86cd799439011',
          quantity: 5,
        })
        .expect(404);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/cart/check-stock')
        .send({
          itemId: '',
          quantity: -1,
        })
        .expect(400);
    });
  });

  describe('/api/cart/validate (POST)', () => {
    it('should validate cart - all items available', () => {
      return request(app.getHttpServer())
        .post('/api/cart/validate')
        .send({
          items: [
            { itemId, quantity: 5 },
            { itemId, quantity: 3 },
          ],
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isValid).toBe(true);
          expect(res.body.errors).toEqual([]);
        });
    });

    it('should validate cart - insufficient stock', () => {
      return request(app.getHttpServer())
        .post('/api/cart/validate')
        .send({
          items: [
            { itemId, quantity: 15 },
          ],
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isValid).toBe(false);
          expect(res.body.errors.length).toBeGreaterThan(0);
        });
    });

    it('should validate cart - item not found', () => {
      return request(app.getHttpServer())
        .post('/api/cart/validate')
        .send({
          items: [
            { itemId: '507f1f77bcf86cd799439011', quantity: 5 },
          ],
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isValid).toBe(false);
          expect(res.body.errors.length).toBeGreaterThan(0);
        });
    });

    it('should fail with empty items array', () => {
      return request(app.getHttpServer())
        .post('/api/cart/validate')
        .send({
          items: [],
        })
        .expect(400);
    });
  });
});

