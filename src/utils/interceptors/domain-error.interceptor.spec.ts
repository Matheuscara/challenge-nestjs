import { DomainErrorInterceptor } from './domain-error.interceptor';
import { DomainError } from '../../domain/errors/domain-error';
import { ResponseMessages } from '../constants/response-messages';
import {
  UnprocessableEntityException,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { of, throwError, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

describe('DomainErrorInterceptor', () => {
  let interceptor: DomainErrorInterceptor;
  const context = {} as ExecutionContext;

  beforeEach(() => {
    interceptor = new DomainErrorInterceptor();
  });

  function createHandler<T>(obs: Observable<T>): CallHandler {
    return {
      handle: () => obs,
    } as CallHandler;
  }

  it('should pass through successful values unchanged', async () => {
    const result$ = interceptor.intercept(
      context,
      createHandler(of('success')),
    );
    await expect(firstValueFrom(result$)).resolves.toBe('success');
  });

  it('should convert DomainError into UnprocessableEntityException', async () => {
    const domainErr = new DomainError('invalid');
    const result$ = interceptor.intercept(
      context,
      createHandler(throwError(() => domainErr)),
    );

    await expect(firstValueFrom(result$)).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
    await expect(firstValueFrom(result$)).rejects.toMatchObject({
      message: ResponseMessages.RULE_ENTITY_NOT_CORRECT,
    });
  });

  it('should rethrow non-domain errors unchanged', async () => {
    const otherErr = new Error('boom');
    const result$ = interceptor.intercept(
      context,
      createHandler(throwError(() => otherErr)),
    );

    await expect(firstValueFrom(result$)).rejects.toBe(otherErr);
  });
});
