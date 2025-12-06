import { ApiProperty } from "@nestjs/swagger";
import { ProductDependency } from "../../domain/product-dependency.entity";

export class ProductDependencyResponseDto {
  @ApiProperty({
    description: "Dependency ID",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  id: string;

  @ApiProperty({
    description: "ID of the main product",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  productId: string;

  @ApiProperty({
    description: "ID of the dependency product (satellite product)",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  dependencyProductId: string;

  @ApiProperty({
    description: "Name of the dependency product",
    example: "Satellite Product Name",
  })
  dependencyProductName?: string;

  @ApiProperty({
    description: "ID of the owner responsible for this dependency",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    required: false,
  })
  ownerId?: string;

  @ApiProperty({
    description: "Name of the owner",
    example: "Owner Name",
    required: false,
  })
  ownerName?: string;

  @ApiProperty({
    description: "ID of the technical lead (talent) for this dependency",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    required: false,
  })
  technicalLeadId?: string;

  @ApiProperty({
    description: "Name of the technical lead",
    example: "Technical Lead Name",
    required: false,
  })
  technicalLeadName?: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-01T00:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-01T00:00:00.000Z",
  })
  updatedAt: Date;

  constructor(dependency: ProductDependency & { dependencyProduct?: any; owner?: any; technicalLead?: any }) {
    this.id = dependency.id;
    this.productId = dependency.productId;
    this.dependencyProductId = dependency.dependencyProductId;
    this.dependencyProductName = dependency.dependencyProduct?.name;
    this.ownerId = dependency.ownerId;
    this.ownerName = dependency.owner?.name;
    this.technicalLeadId = dependency.technicalLeadId;
    this.technicalLeadName = dependency.technicalLead?.name;
    this.createdAt = dependency.createdAt;
    this.updatedAt = dependency.updatedAt;
  }
}

