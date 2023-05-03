// main
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

// controllers
import { AppController } from './app.controller';

// modules
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ImagesModule } from './images/images.module';
import { AdminModule } from './admin/admin.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';

// typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

// services
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      ssl: true,
      synchronize: true,
    }),
    ProductsModule,
    AuthModule,
    CategoriesModule,
    TagsModule,
    OrdersModule,
    ImagesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
