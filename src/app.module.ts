import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { CryptoModule } from './crypto/crypto.module';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [EmployeeModule, CryptoModule, AuthModule, 
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}