export const UserValidation = {
  firstName: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    message:
      'First name can only contain letters, spaces, hyphens and apostrophes',
  },
  lastName: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    message:
      'Last name can only contain letters, spaces, hyphens and apostrophes',
  },
  displayName: {
    min: 3,
    max: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
    message:
      'Display name can only contain letters, numbers, spaces, hyphens and underscores',
  },
  email: {
    min: 5,
    max: 255,
  },
  password: {
    min: 12,
    max: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  },
} as const;
