import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  Length,
  Matches,
  IsString,
  IsEmail as IsEmailDecorator,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserValidation } from '../validation/user.validation';

/**
 * Decorator to validate the first name of a user
 * @returns A decorator function
 */
export function IsFirstName() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Transform(({ value }) => value.trim()),
    Length(UserValidation.firstName.min, UserValidation.firstName.max),
    Matches(UserValidation.firstName.pattern, {
      message: UserValidation.firstName.message,
    }),
  );
}

/**
 * Decorator to validate the last name of a user
 * @returns A decorator function
 */
export function IsLastName() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Transform(({ value }) => value.trim()),
    Length(UserValidation.lastName.min, UserValidation.lastName.max),
    Matches(UserValidation.lastName.pattern, {
      message: UserValidation.lastName.message,
    }),
  );
}

/**
 * Decorator to validate the display name of a user
 * @returns A decorator function
 */
export function IsDisplayName() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Transform(({ value }) => value.trim()),
    Length(UserValidation.displayName.min, UserValidation.displayName.max),
    Matches(UserValidation.displayName.pattern, {
      message: UserValidation.displayName.message,
    }),
  );
}

/**
 * Decorator to validate the email of a user
 * @returns A decorator function
 */
export function IsEmail() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    IsEmailDecorator(),
    Transform(({ value }) => value.trim().toLowerCase()),
    Length(UserValidation.email.min, UserValidation.email.max),
  );
}

/**
 * Decorator to validate the password of a user
 * @returns A decorator function
 */
export function IsPassword() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    IsStrongPassword({
      minLength: UserValidation.password.min,
      minLowercase: UserValidation.password.minLowercase,
      minUppercase: UserValidation.password.minUppercase,
      minNumbers: UserValidation.password.minNumbers,
      minSymbols: UserValidation.password.minSymbols,
    }),
  );
}
