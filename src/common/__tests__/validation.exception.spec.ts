import { ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

describe('ValidationException', () => {
  it('should create an exception with formatted errors', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'email',
        constraints: {
          isEmail: 'email must be a valid email',
          isNotEmpty: 'email should not be empty',
        },
        value: 'invalid-email',
      },
    ];

    const exception = new ValidationException(validationErrors);

    expect(exception.getResponse()).toEqual({
      code: 'VALIDATION_FAILED',
      errors: {
        email: {
          message: ['email must be a valid email', 'email should not be empty'],
          constraints: ['isEmail', 'isNotEmpty'],
          value: 'invalid-email',
        },
      },
    });
  });

  it('should handle multiple validation errors', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'email',
        constraints: {
          isEmail: 'email must be a valid email',
        },
        value: 'invalid-email',
      },
      {
        property: 'password',
        constraints: {
          isNotEmpty: 'password should not be empty',
          minLength: 'password is too short',
        },
        value: '',
      },
    ];

    const exception = new ValidationException(validationErrors);

    expect(exception.getResponse()).toEqual({
      code: 'VALIDATION_FAILED',
      errors: {
        email: {
          message: ['email must be a valid email'],
          constraints: ['isEmail'],
          value: 'invalid-email',
        },
        password: {
          message: ['password should not be empty', 'password is too short'],
          constraints: ['isNotEmpty', 'minLength'],
          value: '',
        },
      },
    });
  });

  it('should handle nested validation errors with children', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'user',
        children: [
          {
            property: 'email',
            constraints: {
              isEmail: 'email must be a valid email',
            },
            value: 'invalid-email',
          },
          {
            property: 'profile',
            children: [
              {
                property: 'age',
                constraints: {
                  isNumber: 'age must be a number',
                  min: 'age must be at least 18',
                },
                value: 16,
              },
            ],
          },
        ],
      },
    ];

    const exception = new ValidationException(validationErrors);

    expect(exception.getResponse()).toEqual({
      code: 'VALIDATION_FAILED',
      errors: {
        'user.email': {
          message: ['email must be a valid email'],
          constraints: ['isEmail'],
          value: 'invalid-email',
        },
        'user.profile.age': {
          message: ['age must be a number', 'age must be at least 18'],
          constraints: ['isNumber', 'min'],
          value: 16,
        },
      },
    });
  });

  it('should inherit from BadRequestException', () => {
    const validationErrors: ValidationError[] = [];

    const exception = new ValidationException(validationErrors);

    expect(exception.getStatus()).toBe(400);
  });
});
