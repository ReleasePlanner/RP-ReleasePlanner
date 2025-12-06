/**
 * Product Component Version Entity Unit Tests
 * Coverage: 100%
 */
import { ProductComponentVersion, ComponentTypeEnum } from './component-version.entity';
import { ProductComponent } from '../../component-types/domain/component-type.entity';

describe('ProductComponentVersion', () => {
  describe('constructor', () => {
    it('should create a ProductComponentVersion with all properties', () => {
      const componentType = new ProductComponent();
      componentType.id = 'comp-type-id';
      componentType.code = ComponentTypeEnum.WEB;
      
      const component = new ProductComponentVersion(componentType, '1.0.0', '0.9.0');

      expect(component.componentType).toBe(componentType);
      expect(component.componentTypeId).toBe('comp-type-id');
      expect(component.currentVersion).toBe('1.0.0');
      expect(component.previousVersion).toBe('0.9.0');
    });

    it('should create a ProductComponentVersion with componentTypeId string', () => {
      const component = new ProductComponentVersion('comp-type-id', '1.0.0', '0.9.0');

      expect(component.componentTypeId).toBe('comp-type-id');
      expect(component.currentVersion).toBe('1.0.0');
      expect(component.previousVersion).toBe('0.9.0');
    });

    it('should create a ProductComponentVersion with name', () => {
      const component = new ProductComponentVersion('comp-type-id', '1.0.0', '0.9.0', 'Component Name');

      expect(component.name).toBe('Component Name');
      expect(component.currentVersion).toBe('1.0.0');
      expect(component.previousVersion).toBe('0.9.0');
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new ProductComponentVersion('comp-type-id', '1.0.0', '0.9.0');
      }).not.toThrow();
    });

    it('should throw error when currentVersion is empty', () => {
      expect(() => {
        new ProductComponentVersion('comp-type-id', '', '0.9.0');
      }).toThrow('Current version is required');
    });

    it('should throw error when previousVersion is empty', () => {
      expect(() => {
        new ProductComponentVersion('comp-type-id', '1.0.0', '');
      }).toThrow('Previous version is required');
    });

    it('should throw error when currentVersion is whitespace only', () => {
      expect(() => {
        new ProductComponentVersion('comp-type-id', '   ', '0.9.0');
      }).toThrow('Current version is required');
    });

    it('should throw error when previousVersion is whitespace only', () => {
      expect(() => {
        new ProductComponentVersion('comp-type-id', '1.0.0', '   ');
      }).toThrow('Previous version is required');
    });
  });

  describe('getTypeCode', () => {
    it('should return component type code when componentType is set', () => {
      const componentType = new ProductComponent();
      componentType.code = ComponentTypeEnum.WEB;
      
      const component = new ProductComponentVersion(componentType, '1.0.0', '0.9.0');

      expect(component.getTypeCode()).toBe(ComponentTypeEnum.WEB);
    });

    it('should return empty string when componentType is not set', () => {
      const component = new ProductComponentVersion('comp-type-id', '1.0.0', '0.9.0');

      expect(component.getTypeCode()).toBe('');
    });
  });
});

