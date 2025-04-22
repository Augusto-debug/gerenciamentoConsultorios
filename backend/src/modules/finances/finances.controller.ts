import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('finances')
@UseGuards(JwtAuthGuard)
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post('incomes')
  createIncome(@Body() createIncomeDto: CreateIncomeDto, @Request() req) {
    return this.financesService.createIncome(createIncomeDto, req.user.userId);
  }

  @Get('incomes')
  findAllIncomes(@Request() req) {
    return this.financesService.findAllIncomes(req.user.userId);
  }

  @Get('incomes/:id')
  findOneIncome(@Param('id') id: string, @Request() req) {
    return this.financesService.findOneIncome(+id, req.user.userId);
  }

  @Patch('incomes/:id')
  updateIncome(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @Request() req,
  ) {
    return this.financesService.updateIncome(+id, updateIncomeDto, req.user.userId);
  }

  @Delete('incomes/:id')
  removeIncome(@Param('id') id: string, @Request() req) {
    return this.financesService.removeIncome(+id, req.user.userId);
  }

  @Post('expenses')
  createExpense(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.financesService.createExpense(createExpenseDto, req.user.userId);
  }

  @Get('expenses')
  findAllExpenses(@Request() req) {
    return this.financesService.findAllExpenses(req.user.userId);
  }

  @Get('expenses/:id')
  findOneExpense(@Param('id') id: string, @Request() req) {
    return this.financesService.findOneExpense(+id, req.user.userId);
  }

  @Patch('expenses/:id')
  updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.financesService.updateExpense(+id, updateExpenseDto, req.user.userId);
  }

  @Delete('expenses/:id')
  removeExpense(@Param('id') id: string, @Request() req) {
    return this.financesService.removeExpense(+id, req.user.userId);
  }

  @Get('summary')
  getFinancialSummary(
    @Query('year') year: string,
    @Query('month') month: string,
    @Request() req,
  ) {
    return this.financesService.getFinancialSummary(
      req.user.userId,
      +year,
      month ? +month : undefined,
    );
  }
}