/**
 * Validation rules for user data
 */
export const UserValidation = {
  /**
   * Ensure the first name is between 2 and 50 characters long
   * and contains only letters, spaces, hyphens and apostrophes
   */
  firstName: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    message:
      'First name can only contain letters, spaces, hyphens and apostrophes',
  },

  /**
   * Ensure the last name is between 2 and 50 characters long
   * and contains only letters, spaces, hyphens and apostrophes
   */
  lastName: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    message:
      'Last name can only contain letters, spaces, hyphens and apostrophes',
  },

  /**
   * Ensure the display name is between 3 and 50 characters long
   * and contains only letters, numbers, spaces, hyphens and underscores
   */
  displayName: {
    min: 3,
    max: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
    message:
      'Display name can only contain letters, numbers, spaces, hyphens and underscores',
  },

  /**
   * Ensure the email is a valid email address
   */
  email: {
    min: 5,
    max: 255,
  },

  /**
   * Ensure the password is between 12 and 100 characters long
   * and contains at least one lowercase letter, one uppercase letter, one number and one special character
   */
  password: {
    min: 12,
    max: 100,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  },
} as const;
