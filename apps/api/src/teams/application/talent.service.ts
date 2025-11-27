import { Injectable, Inject } from '@nestjs/common';
import { Talent } from '../domain/talent.entity';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import type { ITalentRepository } from '../infrastructure/talent.repository';
import {
  ConflictException,
  NotFoundException,
} from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

export interface TalentResponseDto {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TalentService {
  constructor(
    @Inject('ITalentRepository')
    private readonly repository: ITalentRepository,
  ) {}

  async create(dto: CreateTalentDto): Promise<TalentResponseDto> {
    validateObject(dto, 'CreateTalentDto');
    validateString(dto.name, 'Talent name');

    // Check if talent with same email already exists
    if (dto.email) {
      const existing = await this.repository.findOne({ email: dto.email } as any);
      if (existing) {
        throw new ConflictException(
          `Talent with email "${dto.email}" already exists`,
          'DUPLICATE_TALENT_EMAIL',
        );
      }
    }

    const talent = new Talent(
      dto.name,
      dto.email,
      dto.phone,
      dto.roleId,
    );

    const created = await this.repository.create(talent);
    return {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      roleId: created.roleId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findById(id: string): Promise<TalentResponseDto> {
    validateId(id, 'Talent');
    const talent = await this.repository.findById(id);
    if (!talent) {
      throw new NotFoundException('Talent', id);
    }
    return {
      id: talent.id,
      name: talent.name,
      email: talent.email,
      phone: talent.phone,
      roleId: talent.roleId,
      createdAt: talent.createdAt,
      updatedAt: talent.updatedAt,
    };
  }
}

