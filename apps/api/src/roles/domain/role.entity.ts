import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";

@Entity("roles")
@Index(["name"], { unique: true })
export class Role extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  constructor(name?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Role name is required");
    }
    if (this.name.length > 255) {
      throw new Error("Role name must not exceed 255 characters");
    }
  }
}

