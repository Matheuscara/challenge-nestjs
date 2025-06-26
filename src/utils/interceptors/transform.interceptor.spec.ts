import { TransformInterceptor } from './transform.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<string>;
  const context = {} as ExecutionContext;

  beforeEach(() => {
    interceptor = new TransformInterceptor<string>();
  });

  function createHandler<T>(value: T): CallHandler {
    return {
      handle: () => of(value),
    } as CallHandler;
  }

  it('should call next.handle and wrap the emitted value in a { data } object', async () => {
    const value = 'hello world';
    const handler = createHandler(value);

    const result$ = interceptor.intercept(context, handler);
    const result = await firstValueFrom(result$);

    expect(result).toEqual({ data: value });
  });

  it('should work with complex types', async () => {
    type Payload = { id: number; name: string };
    const payload: Payload = { id: 1, name: 'Test' };
    const numberInterceptor = new TransformInterceptor<Payload>();
    const handler = createHandler(payload);

    const result = await firstValueFrom(
      numberInterceptor.intercept(context, handler),
    );
    expect(result).toEqual({ data: payload });
  });

  it('should invoke next.handle exactly once', async () => {
    const value = 123;
    const handler: CallHandler = {
      handle: jest.fn(() => of(value)),
    } as unknown as CallHandler;

    await firstValueFrom(interceptor.intercept(context, handler));
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });
});
