import {
  RESPONSE_MESSAGE,
  ResponseMessage,
} from '../decorators/response-message.decorator';
import { Reflector } from '@nestjs/core';

describe('ResponseMessage Decorator', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('should set metadata with the provided message', () => {
    @ResponseMessage('Test message')
    class TestClass {}

    const message = reflector.get(RESPONSE_MESSAGE, TestClass);
    expect(message).toBe('Test message');
  });

  it('should handle different message values', () => {
    @ResponseMessage('Another message')
    class AnotherTestClass {}

    const message = reflector.get(RESPONSE_MESSAGE, AnotherTestClass);
    expect(message).toBe('Another message');
  });

  it('should return undefined when no message is set', () => {
    class NoMessageClass {}

    const message = reflector.get(RESPONSE_MESSAGE, NoMessageClass);
    expect(message).toBeUndefined();
  });
});
