import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/employee.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    PrismaService,
  ],
})

@UseGuards(JwtAuthGuard)
@Controller('employees')
@Roles('employee')
export class EmployeeController {

  constructor(
    private employeeService: EmployeeService
  ) {}

  @Post()
  create(@Body() data: CreateEmployeeDto) {

    return this.employeeService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {

    return this.employeeService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {

    return this.employeeService.findOne(
      Number(id)
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() data: any,
  ) {

    return this.employeeService.update(
      Number(id),
      data
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {

    return this.employeeService.remove(
      Number(id)
    );
  }
}