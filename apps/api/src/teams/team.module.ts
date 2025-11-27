import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './presentation/team.controller';
import { TalentController } from './presentation/talent.controller';
import { TeamService } from './application/team.service';
import { TalentService } from './application/talent.service';
import { TeamRepository } from './infrastructure/team.repository';
import { TalentRepository } from './infrastructure/talent.repository';
import { Team } from './domain/team.entity';
import { Talent } from './domain/talent.entity';
import { TeamTalentAssignment } from './domain/team-talent-assignment.entity';
import { Role } from '../roles/domain/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Talent, TeamTalentAssignment, Role])],
  controllers: [TeamController, TalentController],
  providers: [
    TeamService,
    TalentService,
    {
      provide: 'ITeamRepository',
      useClass: TeamRepository,
    },
    {
      provide: 'ITalentRepository',
      useClass: TalentRepository,
    },
  ],
  exports: [TeamService, TalentService, 'ITeamRepository', 'ITalentRepository'],
})
export class TeamModule {}

