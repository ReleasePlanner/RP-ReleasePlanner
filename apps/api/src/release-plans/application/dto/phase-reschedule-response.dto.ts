import { ApiProperty } from '@nestjs/swagger';

export class PhaseRescheduleResponseDto {
  @ApiProperty({ description: 'Reschedule ID' })
  id: string;

  @ApiProperty({ description: 'Plan Phase ID' })
  planPhaseId: string;

  @ApiProperty({ description: 'Phase name' })
  phaseName: string;

  @ApiProperty({ description: 'Date and time when the reschedule occurred' })
  rescheduledAt: Date;

  @ApiProperty({ description: 'Original start date', required: false })
  originalStartDate?: string;

  @ApiProperty({ description: 'Original end date', required: false })
  originalEndDate?: string;

  @ApiProperty({ description: 'New start date', required: false })
  newStartDate?: string;

  @ApiProperty({ description: 'New end date', required: false })
  newEndDate?: string;

  @ApiProperty({ description: 'Reschedule type ID', required: false })
  rescheduleTypeId?: string;

  @ApiProperty({ description: 'Reschedule type name', required: false })
  rescheduleTypeName?: string;

  @ApiProperty({ description: 'Owner ID who approved the reschedule', required: false })
  ownerId?: string;

  @ApiProperty({ description: 'Owner name who approved the reschedule', required: false })
  ownerName?: string;

  constructor(
    id: string,
    planPhaseId: string,
    phaseName: string,
    rescheduledAt: Date,
    originalStartDate?: string,
    originalEndDate?: string,
    newStartDate?: string,
    newEndDate?: string,
    rescheduleTypeId?: string,
    rescheduleTypeName?: string,
    ownerId?: string,
    ownerName?: string
  ) {
    this.id = id;
    this.planPhaseId = planPhaseId;
    this.phaseName = phaseName;
    this.rescheduledAt = rescheduledAt;
    this.originalStartDate = originalStartDate;
    this.originalEndDate = originalEndDate;
    this.newStartDate = newStartDate;
    this.newEndDate = newEndDate;
    this.rescheduleTypeId = rescheduleTypeId;
    this.rescheduleTypeName = rescheduleTypeName;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
  }
}

