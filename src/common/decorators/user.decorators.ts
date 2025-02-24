import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  Length,
  Matches,
  IsString,
  IsEmail as IsEmailDecorator,
} from 'class-validator';
import { UserValidation } from '../validation/user.validation';

export function IsFirstName() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Length(UserValidation.firstName.min, UserValidation.firstName.max),
    Matches(UserValidation.firstName.pattern, {
      message: UserValidation.firstName.message,
    }),
  );
}

export function IsLastName() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Length(UserValidation.lastName.min, UserValidation.lastName.max),
    Matches(UserValidation.lastName.pattern, {
      message: UserValidation.lastName.message,
    }),
  );
}

export function IsDisplayName() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Length(UserValidation.displayName.min, UserValidation.displayName.max),
    Matches(UserValidation.displayName.pattern, {
      message: UserValidation.displayName.message,
    }),
  );
}

export function IsEmail() {
  return applyDecorators(
    IsEmailDecorator(),
    IsNotEmpty(),
    Length(UserValidation.email.min, UserValidation.email.max),
  );
}

export function IsPassword() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    Length(UserValidation.password.min, UserValidation.password.max),
    Matches(UserValidation.password.pattern, {
      message: UserValidation.password.message,
    }),
  );
}
