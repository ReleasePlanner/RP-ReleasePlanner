import { PartialType } from "@nestjs/mapped-types";
import { CreatePlanRcaDto } from "./create-plan-rca.dto";

export class UpdatePlanRcaDto extends PartialType(CreatePlanRcaDto) {}

