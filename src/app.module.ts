import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConnectionsModule } from './connections/connections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CommonModule,
    ConnectionsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule {}
