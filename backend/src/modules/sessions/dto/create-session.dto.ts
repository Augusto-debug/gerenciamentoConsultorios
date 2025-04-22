import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty({ message: 'A data é obrigatória' })
  @IsDateString({}, { message: 'Data inválida' })
  date: Date;

  @IsNotEmpty({ message: 'A duração é obrigatória' })
  @IsInt({ message: 'A duração deve ser um número inteiro' })
  @Min(1, { message: 'A duração deve ser maior que zero' })
  duration: number;

  @IsOptional()
  notes?: string;

  @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
  @IsInt({ message: 'ID do paciente deve ser um número inteiro' })
  @IsPositive({ message: 'ID do paciente deve ser positivo' })
  patientId: number;
}