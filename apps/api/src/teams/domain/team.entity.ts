import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";

export enum TeamType {
  INTERNAL = "internal",
  EXTERNAL = "external",
  HYBRID = "hybrid",
}

@Entity("teams")
@Index("IDX_team_name", ["name"], { unique: true })
export class Team extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({
    type: "varchar",
    length: 50,
    default: TeamType.INTERNAL,
    enum: TeamType,
  })
  type: TeamType;

  @OneToMany(
    () => require("./team-talent-assignment.entity").TeamTalentAssignment,
    (assignment: any) => assignment.team,
    {
      cascade: true,
      eager: false,
    }
  )
  talentAssignments?: any[];

  constructor(name?: string, description?: string, type?: TeamType) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
    this.type = type ?? TeamType.INTERNAL;
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Team name is required");
    }
    if (this.type && !Object.values(TeamType).includes(this.type)) {
      throw new Error(`Invalid team type: ${this.type}`);
    }
  }
}
