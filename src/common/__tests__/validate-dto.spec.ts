import { validateDto } from '../utils/validate-dto';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';
import { Transform, Type } from 'class-transformer';

class ChildTestDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

class TestDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNumber()
  age: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ChildTestDto)
  child: ChildTestDto;
}

describe('validateDto', () => {
  it('should return transformed and validated dto when valid', async () => {
    const dto: TestDto = {
      name: 'Test User',
      age: 30,
      child: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    const result = await validateDto(dto, TestDto);

    expect(result).toBeInstanceOf(TestDto);
    expect(result.name).toBe(dto.name);
    expect(result.age).toBe(dto.age);
    expect(result.child).toBeDefined();
    expect(result.child.email).toBe(dto.child.email);
    expect(result.child.password).toBe(dto.child.password);
  });

  it('should transform data types correctly', async () => {
    const dto: TestDto = {
      name: 'Test User',
      age: 30,
      child: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    const result = await validateDto(dto, TestDto);

    expect(typeof result.name).toBe('string');
    expect(typeof result.age).toBe('number');
    expect(result.age).toBe(30);
    expect(result.child).toBeInstanceOf(ChildTestDto);
  });

  it('should trim string values', async () => {
    const dto: TestDto = {
      name: '  Test User  ',
      age: 30,
      child: {
        email: '  test@example.com  ',
        password: 'password123',
      },
    };

    const result = await validateDto(dto, TestDto);

    expect(result.name).toBe('Test User');
    expect(result.child.email).toBe('test@example.com');
  });

  it('should throw ValidationException when parent dto is invalid', async () => {
    const dto: TestDto = {
      name: '',
      age: 30,
      child: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    await expect(validateDto(dto, TestDto)).rejects.toThrow(
      ValidationException,
    );
  });

  it('should throw ValidationException when nested dto is invalid', async () => {
    const dto: TestDto = {
      name: 'Test User',
      age: 30,
      child: {
        email: 'invalid-email',
        password: 'short',
      },
    };

    await expect(validateDto(dto, TestDto)).rejects.toThrow(
      ValidationException,
    );
  });

  it('should throw ValidationException with correct validation errors for nested properties', async () => {
    const dto: TestDto = {
      name: 'Test User',
      age: 30,
      child: {
        email: 'invalid-email',
        password: 'short',
      },
    };

    try {
      await validateDto(dto, TestDto);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
      const response = error.getResponse();

      expect(response.code).toBe('VALIDATION_FAILED');
      expect(response.errors['child.email']).toBeDefined();
      expect(response.errors['child.password']).toBeDefined();

      expect(response.errors['child.email'].value).toBe('invalid-email');
      expect(response.errors['child.password'].value).toBe('short');
    }
  });

  it('should throw ValidationException when parent dto is missing required properties', async () => {
    const dto = {
      name: 'Test User',
    };

    await expect(validateDto(dto, TestDto)).rejects.toThrow(
      ValidationException,
    );
  });

  it('should throw ValidationException when nested dto is missing required properties', async () => {
    const dto = {
      name: 'Test User',
      age: 30,
      child: {
        email: 'test@example.com',
      },
    };

    await expect(validateDto(dto, TestDto)).rejects.toThrow(
      ValidationException,
    );
  });

  // TODO: Should we throw an error when extra properties are present?
  it('should not throw ValidationException when extra properties are present', async () => {
    const dto = {
      name: 'Test User',
      age: 30,
      extraProp: 'should be ignored',
      child: {
        email: 'test@example.com',
        password: 'password123',
        extraChildProp: 'should be ignored',
      },
    };

    const result = await validateDto(dto, TestDto);

    expect(result).toBeInstanceOf(TestDto);
  });
});
