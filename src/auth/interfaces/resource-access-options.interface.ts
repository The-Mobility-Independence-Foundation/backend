/**
 * Options for resource access control
 */
export interface ResourceAccessOptions {
  // Parameter name in route that contains the user ID (e.g., 'userId', 'profileId')
  userIdParam?: string;
  adminOnly?: boolean;
  moderatorAccess?: boolean;
  forbiddenMessage?: string;
}
