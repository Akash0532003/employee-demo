import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEmployeeDto } from './dto/employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(data: CreateEmployeeDto) {


    const pass = await bcrypt.hash(data.pass as unknown as string, 12);

      const employee = await this.prisma.employee.create({
  data: {
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    department: data.department,
    designation: data.designation,
    salary: data.salary,
    pass: pass
  },
});

    if(employee) {
    return {
      code: 200,
      desc: 'Employee created successfully',
      data: employee
    };
    }else{
          return {
      code: 400,
      desc: 'failed to create employee',
      data: employee
    };
    }

    
  }

async findAll() {

    const employee = await  this.prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

        if(employee) {
    return {
      code: 200,
      desc: 'Employee found successfully',
      data: employee
    };
    }else{
          return {
      code: 400,
      desc: 'failed to find',
      data: employee
    };
    }
  }

  async findOne(id: number) {

    const employee = await  this.prisma.employee.findUnique({
      where: {
        id,
      },
    });

        if(employee) {
    return {
      code: 200,
      desc: 'Employee found successfully',
      data: employee
    };
    }else{
          return {
      code: 400,
      desc: 'failed to find employee',
      data: employee
    };
    }
  }

  async update(id: number, data: any) {

    const employee = await  this.prisma.employee.update({
      where: {
        id,
      },
      data,
    });

        if(employee) {
    return {
      code: 200,
      desc: 'Employee updated successfully',
      data: employee
    };
    }else{
          return {
      code: 400,
      desc: 'failed to update',
      data: employee
    };
    }
  }

 async remove(id: number) {

    const employee = await  this.prisma.employee.update({
      where: {
        id: id
      },
          data: {
      status: false
    } 
    });

        if(employee) {
    return {
      code: 200,
      desc: 'Employee removed successfully',
      data: employee
    };
    }else{
          return {
      code: 400,
      desc: 'failed to remove employee',
      data: employee
    };
    }
  }
}