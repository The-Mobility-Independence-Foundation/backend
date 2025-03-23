import {
  ResourceAccess,
  ModeratorAccess,
  AdminOnly,
  UseStrategy,
} from '../decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../interfaces/strategy-provider.interface';
import { RESOURCE_ACCESS } from '../decorators/resource-access.decorator';
import { Reflector } from '@nestjs/core';
import { ResourceAccessOptions } from '../interfaces/resource-access-options.interface';

describe('Resource Access Decorators', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  describe('ResourceAccess', () => {
    it('should set metadata with default options', () => {
      @ResourceAccess()
      class TestClass {}

      const metadata = reflector.get(RESOURCE_ACCESS, TestClass);

      expect(metadata).toEqual({});
    });

    it('should set metadata with custom options', () => {
      const options = {
        adminOnly: true,
        moderatorAccess: true,
        forbiddenMessage: 'Custom message',
      };

      @ResourceAccess(options)
      class TestClass {}

      const metadata = reflector.get(RESOURCE_ACCESS, TestClass);

      expect(metadata).toEqual(options);
    });

    it('should apply to methods as well as classes', () => {
      class TestClass {
        @ResourceAccess()
        testMethod() {}
      }
      const instance = new TestClass();

      const options = reflector.get(RESOURCE_ACCESS, instance.testMethod);

      expect(options).toEqual({});
    });
  });

  describe('ModeratorAccess', () => {
    it('should set moderatorAccess to true with no other options', () => {
      @ModeratorAccess()
      class TestClass {}

      const options = reflector.get(RESOURCE_ACCESS, TestClass);
      expect(options).toEqual({ moderatorAccess: true });
    });

    it('should merge custom options with moderatorAccess set to true', () => {
      const customOptions: Omit<ResourceAccessOptions, 'moderatorAccess'> = {
        forbiddenMessage: 'Moderator only access',
      };

      @ModeratorAccess(customOptions)
      class TestClass {}

      const options = reflector.get(RESOURCE_ACCESS, TestClass);
      expect(options).toEqual({
        ...customOptions,
        moderatorAccess: true,
      });
    });

    it('should apply to methods as well as classes', () => {
      class TestClass {
        @ModeratorAccess()
        testMethod() {}
      }

      const instance = new TestClass();
      const options = reflector.get(RESOURCE_ACCESS, instance.testMethod);
      expect(options).toEqual({ moderatorAccess: true });
    });
  });

  describe('AdminOnly', () => {
    it('should set adminOnly to true with no other options', () => {
      @AdminOnly()
      class TestClass {}

      const options = reflector.get(RESOURCE_ACCESS, TestClass);
      expect(options).toEqual({ adminOnly: true });
    });

    it('should merge custom options with adminOnly set to true', () => {
      const customOptions: Omit<ResourceAccessOptions, 'adminOnly'> = {
        forbiddenMessage: 'Admin only access',
      };

      @AdminOnly(customOptions)
      class TestClass {}

      const options = reflector.get(RESOURCE_ACCESS, TestClass);
      expect(options).toEqual({
        ...customOptions,
        adminOnly: true,
      });
    });

    it('should apply to methods as well as classes', () => {
      class TestClass {
        @AdminOnly()
        testMethod() {}
      }

      const instance = new TestClass();
      const options = reflector.get(RESOURCE_ACCESS, instance.testMethod);
      expect(options).toEqual({ adminOnly: true });
    });
  });

  describe('Combined usage', () => {
    it('should allow different decorators on different methods', () => {
      class TestClass {
        @ResourceAccess()
        resourceMethod() {}

        @AdminOnly()
        adminMethod() {}

        @ModeratorAccess()
        moderatorMethod() {}
      }

      const instance = new TestClass();

      const resourceOptions = reflector.get(
        RESOURCE_ACCESS,
        instance.resourceMethod,
      );
      expect(resourceOptions).toEqual({});

      const adminOptions = reflector.get(RESOURCE_ACCESS, instance.adminMethod);
      expect(adminOptions).toEqual({ adminOnly: true });

      const moderatorOptions = reflector.get(
        RESOURCE_ACCESS,
        instance.moderatorMethod,
      );
      expect(moderatorOptions).toEqual({ moderatorAccess: true });
    });
  });

  describe('UseStrategy', () => {
    it('should set metadata with strategy token', () => {
      @UseStrategy(ResourceAccessStrategyToken.USER)
      class TestClass {}

      const metadata = reflector.get(RESOURCE_ACCESS, TestClass);

      expect(metadata).toEqual({
        strategy: {
          providerToken: ResourceAccessStrategyToken.USER,
        },
      });
    });

    it('should set metadata with strategy token and custom options', () => {
      const options = {
        forbiddenMessage: 'Custom message',
      };

      @UseStrategy(ResourceAccessStrategyToken.USER, options)
      class TestClass {}

      const metadata = reflector.get(RESOURCE_ACCESS, TestClass);

      expect(metadata).toEqual({
        ...options,
        strategy: {
          providerToken: ResourceAccessStrategyToken.USER,
        },
      });
    });

    it('should apply to methods as well as classes', () => {
      class TestClass {
        @UseStrategy(ResourceAccessStrategyToken.USER)
        testMethod() {}
      }

      const instance = new TestClass();
      const metadata = reflector.get(RESOURCE_ACCESS, instance.testMethod);

      expect(metadata).toEqual({
        strategy: {
          providerToken: ResourceAccessStrategyToken.USER,
        },
      });
    });

    it('should merge custom options with strategy configuration', () => {
      const options = {
        forbiddenMessage: 'Custom message',
      };

      @UseStrategy(ResourceAccessStrategyToken.USER, options)
      class TestClass {}

      const metadata = reflector.get(RESOURCE_ACCESS, TestClass);

      expect(metadata).toEqual({
        ...options,
        strategy: {
          providerToken: ResourceAccessStrategyToken.USER,
        },
      });
    });
  });
});
