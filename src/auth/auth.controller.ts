import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {


  constructor(private readonly authService: AuthService) {}

@Post('login')
@Throttle({
  default:{
    limit: 5,
    ttl: 60000
  }
})
login(@Body() body: { email: string; password: string }) {
  console.log('Login request received:', {
    email: body.email,
    hasPassword: Boolean(body.password)
  });

  return this.authService.login(
    body.email,
    body.password
  );
}


}
