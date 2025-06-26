import { DomainError } from './domain-error';

describe('DomainError', () => {
  const message = 'Something went wrong';

  it('should be an instance of Error and DomainError', () => {
    const err = new DomainError(message);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(DomainError);
  });

  it('should set the name property to "DomainError"', () => {
    const err = new DomainError(message);
    expect(err.name).toBe('DomainError');
  });

  it('should include the provided message', () => {
    const err = new DomainError(message);
    expect(err.message).toBe(message);
  });

  it('should have a stack trace defined', () => {
    const err = new DomainError(message);
    expect(typeof err.stack).toBe('string');
    expect(err.stack).toContain('DomainError');
  });
});
