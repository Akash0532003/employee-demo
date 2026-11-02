
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'prisma/prisma.service';
import { ThrottlerModule, ThrottlerGuard  } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),

  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy, // Important: registers the JWT strategy
    PrismaService,
  ],

  exports: [
    PassportModule,
    JwtModule,
    AuthService,
  ],
})
export class AuthModule {}
