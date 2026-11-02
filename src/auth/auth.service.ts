import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

      constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
      ) {}

    async login(email: string, password: string) {
    // TODO: Look up the user in your database.
    // Compare the submitted password with the stored password hash.
    // Never accept a user merely because an email was submitted.

    // const user = await this.validateUser(email, password);

    // if (!user) {
    //   throw new UnauthorizedException('Invalid email or password');
    // }

    // eMail validation 
    const employee= await this.prisma.employee.findUnique({
        where: { email },
    });

    if (!employee || !employee.pass || !employee.status) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Password validation  
    const isPasswordValid = await bcrypt.compare(
        password,
        employee.pass
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
        sub: employee.id,
        email: employee.email,
        role: employee.role,
    });

    return {
        code: 200,
        desc: 'Login successfull',
        data: {
            access_token: accessToken,
            token_type: 'bearer',
            expires_in: 900,
            user: {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            }
        }
    }
    // const accessToken = await this.jwtService.signAsync({
    //   sub: user.id,
    //   email: user.email,
    //   role: user.role,
    // });

    // return {
    //   access_token: accessToken,
    //   token_type: 'Bearer',
    //   expires_in: 900,
    // };
  }

  // private async validateUser(email: string, password: string) {
  //   // Replace this example with your actual database lookup
  //   // and bcrypt password comparison.
  //   // Return null until real credential validation is implemented.
  //   return null;
  // }

}
