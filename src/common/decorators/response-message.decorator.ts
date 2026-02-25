import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for response messages
 */
export const RESPONSE_MESSAGE = 'response_message';

/**
 * Decorator to set a response message
 * @param message - The message to set
 * @returns A decorator function
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
