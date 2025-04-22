import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0, { message: 'O valor deve ser maior ou igual a zero' })
  amount: number;

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsString({ message: 'A categoria deve ser uma string' })
  category: string;

  @IsNotEmpty({ message: 'A data é obrigatória' })
  @IsDateString({}, { message: 'Data inválida' })
  date: Date;
}