import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto, userId: number) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: createSessionDto.patientId,
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${createSessionDto.patientId} não encontrado`);
    }

    return this.prisma.session.create({
      data: {
        ...createSessionDto,
        userId,
      },
      include: {
        patient: true,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.session.findMany({
      where: {
        userId,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const session = await this.prisma.session.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        patient: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Sessão com ID ${id} não encontrada`);
    }

    return session;
  }

  async findByPatient(patientId: number, userId: number) {
    return this.prisma.session.findMany({
      where: {
        patientId,
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async update(id: number, updateSessionDto: UpdateSessionDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
      include: {
        patient: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.session.delete({
      where: { id },
    });
    
    return { success: true };
  }
}