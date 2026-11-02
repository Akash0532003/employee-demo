import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {

  @IsString()
    @IsNotEmpty()
    name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  department!: string;

  @IsString()
  @IsNotEmpty()
  designation!: string;

  @IsNumber()
  salary!: number;

  @IsOptional()
  @IsBoolean()
  status!: boolean;
  length: number | undefined;

    @IsString()
  @MinLength(8)
  pass: string | undefined;
}