import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [FinancesController],
  providers: [FinancesService, PrismaService],
})
export class FinancesModule {}