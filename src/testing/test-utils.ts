import { ModuleMetadata, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export class TestingHelper {
  static async createTestingModule<T>(
    metadata: ModuleMetadata,
    targetClass: Type<T>,
  ): Promise<{ module: TestingModule; instance: T }> {
    const module: TestingModule =
      await Test.createTestingModule(metadata).compile();
    const instance = module.get<T>(targetClass);

    return { module, instance };
  }

  // static createMockProvider(provider: any) {
  //   return {
  //     provide: provider,
  //     useValue: createMock<typeof provider>(),
  //   };
  // }

  // static async createTestingModuleWithMocks<T>(
  //   metadata: ModuleMetadata,
  //   targetClass: Type<T>,
  //   mockedProviders: Type<any>[],
  // ) {
  //   const mockProviders = mockedProviders.map((provider) =>
  //     this.createMockProvider(provider),
  //   );

  //   return this.createTestingModule(
  //     {
  //       ...metadata,
  //       providers: [...(metadata.providers || []), ...mockProviders],
  //     },
  //     targetClass,
  //   );
  // }
}
