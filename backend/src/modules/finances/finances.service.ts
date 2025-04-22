import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class FinancesService {
  constructor(private prisma: PrismaService) {}

  async createIncome(createIncomeDto: CreateIncomeDto, userId: number) {
    return this.prisma.income.create({
      data: {
        ...createIncomeDto,
        userId,
      },
    });
  }

  async findAllIncomes(userId: number) {
    return this.prisma.income.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOneIncome(id: number, userId: number) {
    const income = await this.prisma.income.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!income) {
      throw new NotFoundException(`Receita com ID ${id} não encontrada`);
    }

    return income;
  }

  async updateIncome(id: number, updateIncomeDto: UpdateIncomeDto, userId: number) {
    await this.findOneIncome(id, userId);

    return this.prisma.income.update({
      where: { id },
      data: updateIncomeDto,
    });
  }

  async removeIncome(id: number, userId: number) {
    await this.findOneIncome(id, userId);

    await this.prisma.income.delete({
      where: { id },
    });
    
    return { success: true };
  }

  async createExpense(createExpenseDto: CreateExpenseDto, userId: number) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        userId,
      },
    });
  }

  async findAllExpenses(userId: number) {
    return this.prisma.expense.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOneExpense(id: number, userId: number) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    }

    return expense;
  }

  async updateExpense(id: number, updateExpenseDto: UpdateExpenseDto, userId: number) {
    await this.findOneExpense(id, userId);

    return this.prisma.expense.update({
      where: { id },
      data: updateExpenseDto,
    });
  }

  async removeExpense(id: number, userId: number) {
    await this.findOneExpense(id, userId);

    await this.prisma.expense.delete({
      where: { id },
    });
    
    return { success: true };
  }

  async getFinancialSummary(userId: number, year: number, month?: number) {
    const startDate = month 
      ? new Date(year, month - 1, 1) 
      : new Date(year, 0, 1);
    
    const endDate = month 
      ? new Date(year, month, 0) 
      : new Date(year, 11, 31);

    const [incomes, expenses] = await Promise.all([
      this.prisma.income.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      period: {
        year,
        month: month || null,
      },
    };
  }
}