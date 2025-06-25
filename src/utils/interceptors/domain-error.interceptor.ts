import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResponseMessages } from '../constants/response-messages';
import { DomainError } from 'src/domain/errors/domain-error';

@Injectable()
export class DomainErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: Error) => {
        if (err instanceof DomainError) {
          return throwError(
            () =>
              new UnprocessableEntityException(
                ResponseMessages.RULE_ENTITY_NOT_CORRECT,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
