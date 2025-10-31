import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig, validationSchema } from './config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ItemsModule } from './items/items.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    ItemsModule,
    CartModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: process.env.MONGODB_URL || configService.get<string>('app.mongo.connection'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
