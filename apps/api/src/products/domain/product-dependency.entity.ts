/**
 * Product Dependency Entity (TypeORM)
 * 
 * Represents a dependency relationship between products.
 * A product can have multiple dependencies (satellite products) that interact with it.
 */
import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";

@Entity("product_dependencies")
@Index(["productId"])
@Index(["dependencyProductId"])
@Index(["productId", "dependencyProductId"], { unique: true }) // Prevent duplicate dependencies
export class ProductDependency extends BaseEntity {
  @Column({ type: "uuid" })
  productId: string; // Main product

  @ManyToOne(() => require("./product.entity").Product, {
    nullable: false,
    eager: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product?: any;

  @Column({ type: "uuid" })
  dependencyProductId: string; // Satellite/dependent product

  @ManyToOne(() => require("./product.entity").Product, {
    nullable: false,
    eager: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "dependencyProductId" })
  dependencyProduct?: any;

  @Column({ type: "uuid", nullable: true })
  ownerId?: string; // Owner of the dependency relationship

  @ManyToOne(() => require("../../owners/domain/owner.entity").Owner, {
    nullable: true,
    eager: false,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "ownerId" })
  owner?: any;

  @Column({ type: "uuid", nullable: true })
  technicalLeadId?: string; // Technical lead (from talents)

  @ManyToOne(() => require("../../teams/domain/talent.entity").Talent, {
    nullable: true,
    eager: false,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "technicalLeadId" })
  technicalLead?: any;

  constructor(
    productId?: string,
    dependencyProductId?: string,
    ownerId?: string,
    technicalLeadId?: string
  ) {
    super();
    if (productId !== undefined) {
      this.productId = productId;
    }
    if (dependencyProductId !== undefined) {
      this.dependencyProductId = dependencyProductId;
    }
    if (ownerId !== undefined) {
      this.ownerId = ownerId;
    }
    if (technicalLeadId !== undefined) {
      this.technicalLeadId = technicalLeadId;
    }
    if (productId !== undefined && dependencyProductId !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.productId) {
      throw new Error("Product ID is required");
    }
    if (!this.dependencyProductId) {
      throw new Error("Dependency product ID is required");
    }
    if (this.productId === this.dependencyProductId) {
      throw new Error("A product cannot depend on itself");
    }
  }
}

