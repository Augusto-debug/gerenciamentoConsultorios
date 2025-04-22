import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto, userId: number) {
    return this.prisma.patient.create({
      data: {
        ...createPatientDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.patient.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.patient.delete({
      where: { id },
    });
    
    return { success: true };
  }
}