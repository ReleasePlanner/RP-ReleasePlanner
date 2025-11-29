/**
 * Update Reschedule Type DTO
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateRescheduleTypeDto } from './create-reschedule-type.dto';

export class UpdateRescheduleTypeDto extends PartialType(CreateRescheduleTypeDto) {}

