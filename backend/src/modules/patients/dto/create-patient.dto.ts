import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'As notas devem ser uma string' })
  notes?: string;
}