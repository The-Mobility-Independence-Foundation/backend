/**
 * Options for resource access control
 */
export interface ResourceAccessOptions {
  // Parameter name in route that contains the user id (ex: 'userId', 'profileId', ...)
  // TODO: Maybe we can extend this to support other resource types (ex: 'postId', 'commentId', ...)
  userIdParam?: string;
  adminOnly?: boolean;
  moderatorAccess?: boolean;
  forbiddenMessage?: string;
}
