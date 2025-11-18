/**
 * Plan Response DTO Tests
 * Coverage: 100%
 */
import { Plan, PlanStatus } from '../../domain/plan.entity';
import { PlanPhase } from '../../domain/plan-phase.entity';
import { PlanTask } from '../../domain/plan-task.entity';
import { PlanMilestone } from '../../domain/plan-milestone.entity';
import { PlanReference, PlanReferenceContentType } from '../../domain/plan-reference.entity';
import {
  PlanResponseDto,
  PlanPhaseResponseDto,
  PlanTaskResponseDto,
  PlanMilestoneResponseDto,
  PlanReferenceResponseDto,
} from './plan-response.dto';

describe('PlanResponseDto', () => {
  describe('PlanPhaseResponseDto', () => {
    it('should create DTO from entity', () => {
      const phase = new PlanPhase('Phase 1', '2024-01-01', '2024-01-31', '#FF0000');
      phase.id = 'phase-id';
      phase.createdAt = new Date();
      phase.updatedAt = new Date();

      const dto = new PlanPhaseResponseDto(phase);

      expect(dto.id).toBe('phase-id');
      expect(dto.name).toBe('Phase 1');
      expect(dto.startDate).toBe('2024-01-01');
      expect(dto.endDate).toBe('2024-01-31');
      expect(dto.color).toBe('#FF0000');
      expect(dto.createdAt).toBe(phase.createdAt);
      expect(dto.updatedAt).toBe(phase.updatedAt);
    });
  });

  describe('PlanTaskResponseDto', () => {
    it('should create DTO from entity', () => {
      const task = new PlanTask('Task 1', '2024-01-01', '2024-01-31', '#00FF00');
      task.id = 'task-id';
      task.createdAt = new Date();
      task.updatedAt = new Date();

      const dto = new PlanTaskResponseDto(task);

      expect(dto.id).toBe('task-id');
      expect(dto.title).toBe('Task 1');
      expect(dto.startDate).toBe('2024-01-01');
      expect(dto.endDate).toBe('2024-01-31');
      expect(dto.color).toBe('#00FF00');
      expect(dto.createdAt).toBe(task.createdAt);
      expect(dto.updatedAt).toBe(task.updatedAt);
    });
  });

  describe('PlanMilestoneResponseDto', () => {
    it('should create DTO from entity', () => {
      const milestone = new PlanMilestone('2024-01-15', 'Milestone 1', 'Description');
      milestone.id = 'milestone-id';
      milestone.createdAt = new Date();
      milestone.updatedAt = new Date();

      const dto = new PlanMilestoneResponseDto(milestone);

      expect(dto.id).toBe('milestone-id');
      expect(dto.date).toBe('2024-01-15');
      expect(dto.name).toBe('Milestone 1');
      expect(dto.description).toBe('Description');
      expect(dto.createdAt).toBe(milestone.createdAt);
      expect(dto.updatedAt).toBe(milestone.updatedAt);
    });
  });

  describe('PlanReferenceResponseDto', () => {
    it('should create DTO from entity', () => {
      // Create a mock PlanReferenceType for testing
      const planReferenceType = { id: 'plan-type-id', name: 'plan' };
      
      const reference = new PlanReference(
        PlanReferenceContentType.DOCUMENT,
        'Title',
        'https://example.com',
        'Description',
        'plan-type-id', // planReferenceTypeId
        undefined, // periodDay
        undefined, // calendarDayId
        'phase-id', // phaseId
        '2024-01-01', // Legacy date
        undefined // milestoneColor
      );
      reference.id = 'ref-id';
      reference.planReferenceType = planReferenceType as any;
      reference.createdAt = new Date();
      reference.updatedAt = new Date();

      const dto = new PlanReferenceResponseDto(reference);

      expect(dto.id).toBe('ref-id');
      expect(dto.type).toBe(PlanReferenceContentType.DOCUMENT);
      expect(dto.title).toBe('Title');
      expect(dto.url).toBe('https://example.com');
      expect(dto.description).toBe('Description');
      expect(dto.planReferenceTypeId).toBe('plan-type-id');
      expect(dto.date).toBe('2024-01-01');
      expect(dto.phaseId).toBe('phase-id');
      expect(dto.createdAt).toBe(reference.createdAt);
      expect(dto.updatedAt).toBe(reference.updatedAt);
    });
  });

  describe('PlanResponseDto', () => {
    it('should create DTO from complete plan entity', () => {
      const plan = new Plan('Test Plan', '2024-01-01', '2024-12-31', PlanStatus.PLANNED, 'Description');
      plan.id = 'plan-id';
      plan.productId = 'product-id';
      plan.itOwner = 'it-owner-id';
      plan.featureIds = ['feature-1', 'feature-2'];
      plan.components = [{ componentId: 'comp-1', currentVersion: '0.9.0', finalVersion: '1.0.0' }];
      plan.calendarIds = ['calendar-1'];
      (plan as any).ownerName = 'Owner Name'; // Mock ownerName from JOIN
      plan.createdAt = new Date();
      plan.updatedAt = new Date();

      const phase = new PlanPhase('Phase 1', '2024-01-01', '2024-01-31');
      phase.id = 'phase-id';
      plan.phases = [phase];

      const task = new PlanTask('Task 1', '2024-01-01', '2024-01-31');
      task.id = 'task-id';
      plan.tasks = [task];

      const milestone = new PlanMilestone('2024-01-15', 'Milestone 1');
      milestone.id = 'milestone-id';
      plan.milestones = [milestone];

      const planReferenceType = { id: 'plan-type-id', name: 'plan' };
      const reference = new PlanReference(
        PlanReferenceContentType.DOCUMENT,
        'Title',
        'https://example.com',
        undefined,
        'plan-type-id'
      );
      reference.id = 'ref-id';
      reference.planReferenceType = planReferenceType as any;
      plan.references = [reference];

      const dto = new PlanResponseDto(plan);

      expect(dto.id).toBe('plan-id');
      expect(dto.name).toBe('Test Plan');
      expect(dto.owner).toBe('Owner Name');
      expect(dto.startDate).toBe('2024-01-01');
      expect(dto.endDate).toBe('2024-12-31');
      expect(dto.status).toBe(PlanStatus.PLANNED);
      expect(dto.description).toBe('Description');
      expect(dto.productId).toBe('product-id');
      expect(dto.itOwner).toBe('it-owner-id');
      expect(dto.featureIds).toEqual(['feature-1', 'feature-2']);
      expect(dto.components).toEqual([{ componentId: 'comp-1', currentVersion: '0.9.0', finalVersion: '1.0.0' }]);
      expect(dto.calendarIds).toEqual(['calendar-1']);
      expect(dto.phases).toHaveLength(1);
      expect(dto.tasks).toHaveLength(1);
      expect(dto.milestones).toHaveLength(1);
      expect(dto.references).toHaveLength(1);
      expect(dto.createdAt).toBe(plan.createdAt);
      expect(dto.updatedAt).toBe(plan.updatedAt);
    });

    it('should handle empty arrays', () => {
      const plan = new Plan('Test Plan', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      plan.id = 'plan-id';
      plan.createdAt = new Date();
      plan.updatedAt = new Date();

      const dto = new PlanResponseDto(plan);

      expect(dto.phases).toEqual([]);
      expect(dto.tasks).toEqual([]);
      expect(dto.milestones).toEqual([]);
      expect(dto.references).toEqual([]);
    });
  });
});

