/**
 * Owners Module
 * Exports Owner and OwnerType entities for use in other modules
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './domain/owner.entity';
import { OwnerType } from './domain/owner-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, OwnerType])],
  exports: [TypeOrmModule],
})
export class OwnersModule {}

