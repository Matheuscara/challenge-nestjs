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

@Injectable()
export class UnprocessableEntityInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof UnprocessableEntityException) {
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
