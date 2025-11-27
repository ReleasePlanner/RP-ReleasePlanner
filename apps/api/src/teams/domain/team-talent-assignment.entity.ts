import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryColumn,
} from "typeorm";
import { Team } from "./team.entity";
import { Talent } from "./talent.entity";

/**
 * Junction entity for Many-to-Many relationship between Team and Talent
 * Includes allocation percentage for each assignment
 */
@Entity("team_talent_assignments")
@Index(["teamId"])
@Index(["talentId"])
@Index(["teamId", "talentId"], { unique: true })
export class TeamTalentAssignment {
  @PrimaryColumn({ type: "uuid" })
  teamId: string;

  @PrimaryColumn({ type: "uuid" })
  talentId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0,
    comment: "Allocation percentage (0-100)",
  })
  allocationPercentage: number;

  @ManyToOne(() => Team, (team) => team.talentAssignments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "teamId" })
  team?: Team;

  @ManyToOne(() => Talent, (talent) => talent.teamAssignments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "talentId" })
  talent?: Talent;

  constructor(
    teamId?: string,
    talentId?: string,
    allocationPercentage?: number
  ) {
    if (teamId !== undefined) {
      this.teamId = teamId;
    }
    if (talentId !== undefined) {
      this.talentId = talentId;
    }
    this.allocationPercentage = allocationPercentage ?? 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    if (
      teamId !== undefined &&
      talentId !== undefined &&
      allocationPercentage !== undefined
    ) {
      this.validate();
    }
  }

  validate(): void {
    if (this.allocationPercentage < 0 || this.allocationPercentage > 100) {
      throw new Error("Allocation percentage must be between 0 and 100");
    }
    if (!this.teamId || !this.talentId) {
      throw new Error("Team ID and Talent ID are required");
    }
  }
}
