import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";
import { Role } from "../../roles/domain/role.entity";
import { TeamTalentAssignment } from "./team-talent-assignment.entity";

@Entity("talents")
@Index(["email"], { unique: true })
@Index(["roleId"])
export class Talent extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone?: string;

  @Column({ type: "uuid", nullable: true })
  roleId?: string;

  @ManyToOne(() => Role, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: "roleId" })
  role?: Role;

  @OneToMany(() => TeamTalentAssignment, (assignment) => assignment.talent, {
    cascade: true,
    eager: false,
  })
  teamAssignments?: TeamTalentAssignment[];

  constructor(name?: string, email?: string, phone?: string, roleId?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (email !== undefined) {
      this.email = email;
    }
    if (phone !== undefined) {
      this.phone = phone;
    }
    if (roleId !== undefined) {
      this.roleId = roleId;
    }
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Talent name is required");
    }
    if (this.email && !this.isValidEmail(this.email)) {
      throw new Error("Invalid email format");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
